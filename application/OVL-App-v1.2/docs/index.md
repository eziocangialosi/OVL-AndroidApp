# Welcome to the OVL Application documentation

## main

``` js
import { useState, useEffect, useRef } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, TouchableOpacity, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

/* Importation des classes/fonctions des autres fichiers */
import LoginScreen from './components/loginScreen';
import TrackerScreen from './components/trackerScreen';
import AddTrackerScreen from './components/addTrackerScreen';
import CoordinatesScreen from './components/coordinatesScreen';
import HistoryScreen from './components/historyScreen';
import SettingsScreen from './components/settingsScreen';
import RegisterScreen from './components/registerScreen';

/* Demande à l'utilisateur les permissions pour recevoir des notifications et récupère son token */
async function registerForPushNotificationsAsync() {
  let token = '';

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  /* Si l'utilisateur est sur un vrai téléphone */
  if (Device.isDevice) {
    /* Demande les permissions */
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    /* Si les permissions ne sont pas déjà accordées, les demandes */
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    /* Si les permissions n'ont pas été accordé, affiche une erreur */
    if (finalStatus !== 'granted') {
      console.log('Permissions for notifications have been denied');
      return;
      /* Si les permissisons ont été acceptées, récupère le token de l'utilisateur. */
    } else {
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    }
    /* Si l'utilisateur n'est pas sur un vrai téléphone (web, emulateur...), affiche une erreur */
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

/* Fonction principale : elle se lance lorsque l'application démarre */
const Main = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      {/* Définie l'interface de connexion comme l'interface initiale */}
      <Stack.Navigator initialRouteName="InitNavigator">
        <Stack.Screen name="InitNavigator" component={Init} />
        <Stack.Screen
          options={{ headerShown: false }}
          name="LoginNavigator"
          component={LoginScreen}
        />
        <Stack.Screen
          name="TrackerNavigator"
          component={({ route }) => (
            <TrackerScreen
              token={route.params.token}
              navigation={route.params.navigation}
            />
          )}
        />
        <Stack.Screen name="AddTrackerNavigator" component={AddTrackerScreen} />
        <Stack.Screen
          name="CoordinatesNavigator"
          component={({ route }) => (
            <CoordinatesScreen
              trackerId={route.params.trackerId}
              navigation={route.params.navigation}
              token={route.params.token}
            />
          )}
        />
        <Stack.Screen
          name="HistoryNavigator"
          component={({ route }) => (
            <HistoryScreen trackerId={route.params.trackerId} />
          )}
        />
        <Stack.Screen
          name="SettingsNavigator"
          component={({ route }) => (
            <SettingsScreen
              trackerId={route.params.trackerId}
              token={route.params.token}
            />
          )}
        />
        <Stack.Screen name="RegisterNavigator" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Init = ({ navigation }) => {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });

    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
      }
    );

    navigation.navigate('LoginNavigator', {
      expoToken: expoPushToken,
    });
  });
};

export default Main;


```

## loginScreen

``` js

import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';
import * as Notifications from 'expo-notifications';

/* Importation des styles */
import Styles from './styles';
import LoginStyles from './loginStyles';

/* Fonction qui permet d'afficher la page de connexion et d'intéragir avec elle
Reçoit en paramètre la variable 'navigation' permettant de changer de page */
function LoginScreen({ route, navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { expoToken } = route.params;

  /* Affiche des logs au lancement et à la 'destruction'*/
  useEffect(() => {
    console.log('');
    console.log('LOGIN SCREEN LOGS :');
  }, []);

  /* Fonction qui va faire une requête à l'API en envoyant l'email et le mot de passe saisi par l'utilisateur afin de
  recevoir son token */
  const getToken = async () => {
    /* Si il y a au moins 1 champ vide, affiche une erreur */
    if (email == '' || password == '') {
      alert('Please enter information in the fields');
      /* Si le champ 'e-mail ne contient pas d'arobase, affiche une erreur */
    } else if (/@/g.test(email) == 0) {
      alert('Please enter correct email in the field');
    } else {
      try {
        console.log('Email : ' + email);
        console.log('Password : ' + password);
        /* Fait une réquête à l'API en lui donnant l'email et le mot de passe saisi par l'utilisateur */
        const response = await fetch(
          'https://api.ovl.tech-user.fr/user/' + email + '/' + password
        );
        /* Met la réponde se l'API dans la variable 'json' */
        const json = await response.json();
        console.log(json);
        /* Si il n'y a pas d'erreur, change la fenêtre de navigation pour celle de selection du tracker
        en envoyant le token et la variable 'navigation'  */
        if (json.error.Message == 'Nothing goes wrong.') {
          console.log('LoginScreen token : ' + json.user);
          navigation.navigate('TrackerNavigator', {
            token: json.user,
            navigation: navigation,
          });
          /* Sinon, affiche un message d'erreur indiquant que les identifiants sont incorrects. */
        } else {
          alert("Nom d'utilisateur ou mot de passe incorrect.");
        }
      } catch (error) {
        /* Si l'API ne répond pas, affiche une erreur indiquant que l'API ne fonctionne pas */
        console.log(error);
        alert('API down');
      }
    }
  };

  return (
    <View style={Styles.container}>
      <SafeAreaView>
        {/* Créé le champ 'email' : lorsque l'utilisateur écrit quelque chose dedans, le met dans la variable 'email' */}
        <Text style={Styles.paragraph}>E-mail</Text>
        <TextInput
          style={Styles.input}
          onChangeText={(text) => setEmail(text)}
          value={email}
        />
        {/* Créé le champ 'password' : lorsque l'utilisateur écrit quelque chose dedans, le met dans la variable 'password' */}
        <Text style={Styles.paragraph}>Password</Text>
        <TextInput
          style={Styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
        />
      </SafeAreaView>
      <View style={Styles.mapButtonContainer}>
        <TouchableOpacity
          style={LoginStyles.loginButton}
          onPress={() =>
            navigation.navigate('RegisterNavigator', {
              expoPushToken: expoToken,
            })
          }>
          <Text style={LoginStyles.loginButtonText}>Register</Text>
        </TouchableOpacity>

        {/* Créé un bouton de connexion qui va appeller la fonction 'getToken' */}
        <TouchableOpacity
          style={LoginStyles.loginButton}
          onPress={() => getToken()}>
          <Text style={LoginStyles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
      
    </View>
  );
};

export default LoginScreen;


```

## registerScreen

``` js

import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  TextInput,
} from 'react-native';

/* Importation des styles */
import Styles from './styles';
import LoginStyles from './loginStyles';

/* Permet de faire une requête à l'API pour ajouter un utilisateur
Reçoit en paramètre l'email de l'utilisateur, son mot de passe et la variable 'navigation' */
const Register = (
  email,
  password,
  confirmPassword,
  expoPushToken,
  navigation
) => {
  /* Si l'utilisateur n'a rien saisi dans un des champs, affiche une erreur */
  console.log(expoPushToken);
  if (email == '' || password == '' || confirmPassword == '') {
    alert('Please enter information in the fields');
    /* Si l'utilisateur n'a pas saisi le même mot de passe */
  } else if (password !== confirmPassword) {
    alert("Passwords fields haven't the same information");
    /* Si l'utilisateur ne rentre pas un email */
  } else if (
    /@/g.test(email) == 0 ||
    / /g.test(email) == 1 ||
    email.length > 255
  ) {
    alert('Please enter correct email in the field');
    /* Si l'utilisateur met un espace dans le mot de passe */
  } else if (/ /g.test(password) == 1) {
    alert("Please don't put a space in the password field");
    /* Si l'utilisateur saisi un mot de passe trop long ou trop court */
  } else if (password.length < 8 || password.length > 24) {
    alert('Please enter a password between 8 and 24 characters');
  } else {
    /* Sinon, fait une requête 'POST' à l'API en envoyant l'email, le mot de passe et le token expo de l'utilisateur */
    alert(expoPushToken);
    fetch('https://api.ovl.tech-user.fr/user/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      /* Données envoyées à l'API */
      body: JSON.stringify({
        mail: email,
        password: password,
        notif: expoPushToken,
      }),
    })
      /* Récupère la réponse de l'API */
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        /* Si il n'y a pas eu d'erreur, envoie l'utilisateur à la page de login et affiche un succès d'inscription */
        if (json.error.Message == 'Nothing goes wrong.') {
          alert(
            'Registration has been successfully completed.\n' +
              'topicTX : ' +
              json.Topics.TX +
              '\n' +
              'topicRX : ' +
              json.Topics.RX +
              '\n' +
              'trackerID : ' +
              json.TrackerId
          );
          navigation.goBack();
        }
      });
  }
};

/* Affiche la page d'ajout de traqueur
Reçoit en paramètre la variable 'navigation' */
function RegisterScreen({ route, navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const { expoPushToken } = route.params;

  /* Affiche des logs au lancement et à la 'destruction'*/
  useEffect(() => {
    console.log('');
    console.log('REGISTER LOGS :');
  }, []);

  return (
    <View style={Styles.container}>
      {/* Créé un champ qui met dans la variable 'email' ce que saisi l'utilisateur */}
      <Text style={Styles.paragraph}>E-mail</Text>
      <TextInput
        style={Styles.input}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      {/* Créé un champ qui met dans la variable 'password' ce que saisi l'utilisateur */}
      <Text style={Styles.paragraph}>Password</Text>
      <TextInput
        style={Styles.input}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry={true}
      />
      {/* Créé un champ qui met dans la variable 'confirmPassword' ce que saisi l'utilisateur */}
      <Text style={Styles.paragraph}>Confirm Password</Text>
      <TextInput
        style={Styles.input}
        onChangeText={(text) => setconfirmPassword(text)}
        value={confirmPassword}
        secureTextEntry={true}
      />
      {/* Créé un bouton qui va appeller la fonction 'AddTraqueur' */}
      <TouchableOpacity
        style={LoginStyles.addTrackerButton}
        onPress={() =>
          Register(email, password, confirmPassword, expoPushToken, navigation)
        }>
        <Text style={LoginStyles.loginButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

export default RegisterScreen;

```

## addTrackerScreen

``` js

import React, { Component } from 'react';
import { FlatList, View, TouchableOpacity, Text } from 'react-native';

/* Importation des styles */
import Styles from './styles';
import TrackerStyles from './trackerStyles';

/* Affiche un boutons avec le nom du traqueur reçu.
Reçoit en paramètre le token de l'utilisateur, le nom de son traqueur avec son ID et la variable 'navigation' */
const ButtonCreator = ({
  trackerName,
  trackerId,
  navigation,
  token,
}: ItemProps) => (
  <View style={Styles.item}>
    {/* Si le bouton est cliqué, passe à la page qui affiche les coordonnées du traqueur */}
    <TouchableOpacity
      style={TrackerStyles.trackerButtonContainer}
      onPress={() =>
        navigation.navigate('CoordinatesNavigator', {
          trackerId: trackerId,
          navigation: navigation,
          token: token,
        })
      }>
      <Text style={TrackerStyles.appButtonText}>{trackerName}</Text>
    </TouchableOpacity>
  </View>
);

/* Paramètres de la class 'TrackerScreen' */
interface AppProps {
  navigation: any;
  token: string;
}

/* Atributs de la class TrackerScreen */
interface AppState {
  data: any[];
}

/* Permet d'afficher la liste des traqueur d'un utilisateur
Reçoit en paramètre le token de l'utilisateur et la variable 'navigation' */
export default class TrackerScreen extends Component<AppProps, AppState> {
  state: AppState = {
    data: [],
  };

  /* Fonction qui va faire une requête à l'API en envoyant le token de l'utilisateur
  pour recevoir le nom et l'ID de ses traqueurs*/
  async getTrackers() {
    try {
      /* Fait une réquête à l'API en lui donnant le token de l'utilisateur */
      const response = await fetch(
        'https://api.ovl.tech-user.fr/iot_list/' + this.props.token
      );
      /* Met la réponde de l'API dans la variable 'json' */
      const json = await response.json();
      console.log(json);
      /* Si il n'y a pas d'erreur, met le nom et l'ID des traqueurs dans le tableau 'data' */
      if (json.error.Message == 'Nothing goes wrong.') {
        this.setState({ data: json.trackers.iotArray });
      } else {
        /* Sinon, affiche une erreur */
        alert('Unknown error');
      }
    } catch (error) {
      /* Si l'API ne répond pas, affiche une erreur indiquant que l'API ne fonctionne pas */
      console.log(error);
      alert('API down');
    }
  }

  /* Lorsque la class se créé, lance la fonction 'getTrackers' */
  componentDidMount() {
    console.log('');
    console.log('TRACKER SCREEN LOGS :');
    console.log('TrackerScreen token : ' + this.props.token);
    this.getTrackers();
  }

  render() {
    const { data } = this.state;

    return (
      <View style={Styles.container}>
        {/* Envoie l'utilisateur à la page d'ajout de traqueur en envoyant son token */}
        <TouchableOpacity
          style={TrackerStyles.addTrackerButtonContainer}
          onPress={() =>
            this.props.navigation.navigate('AddTrackerNavigator', {
              token: this.props.token,
            },)
          }>
          <Text style={TrackerStyles.appButtonText}>Add tracker</Text>
        </TouchableOpacity>

        {/* Rafraichi la page en appelant la fonction 'getTrackers' */}
        <TouchableOpacity
          style={TrackerStyles.addTrackerButtonContainer}
          onPress={() => this.getTrackers()}>
          <Text style={TrackerStyles.appButtonText}>Refresh</Text>
        </TouchableOpacity>

        <Text style={TrackerStyles.listText}>Tracker list :</Text>
        {/* Affiche un bouton pour chaque tracker récupéré par la fonction 'getTrackers' (en utilisant la fonction 'ButtonCreator') */}
        <FlatList
          data={data}
          renderItem={({ item }) => (
            <ButtonCreator
              trackerName={item.trackerName}
              trackerId={item.id}
              navigation={this.props.navigation}
              token={this.props.token}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    );
  }
}

```

## historyScreen

``` js

import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  SafeAreaView,
  TextInput,
} from 'react-native';

/* Importation des styles */
import Styles from './styles';
import LoginStyles from './loginStyles';

/* Permet de faire une requête à l'API pour ajouter un traqueur
Reçoit en paramètre le token de l'utilisateur, le nom de son traqueur et la variable 'navigation' */
const AddTracker = (token, trackerName, navigation) => {
  /* Si l'utilisateur n'a pas saisi le nom de son nouveau traqueur, affiche une erreur */
  if (trackerName == '') {
    alert('Please enter the name of your tracker');
  } else {
    /* Sinon, fait une requête 'PUT' à l'API en envoyant le token de l'utilisateur et le nom du traqueur qui a été sélectionné */
    fetch('https://api.ovl.tech-user.fr/iot', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      /* Données envoyées à l'API */
      body: JSON.stringify({
        token: token,
        name: trackerName,
      }),
    })
      /* Récupère la réponse de l'API */
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        /* Si il n'y a pas eu d'erreur, affiche le nom du traqueur, son ID et ses coordonnées et envoie l'utilisateur à la page de sélction 
        des traqueurs en renvoyant le token */
        if (json.error.Message == 'Nothing goes wrong.') {
          alert(
            'Tracker name : ' + trackerName + '\n' +
            'Tracker ID : ' + json.TrackerId + '\n' +
            'TopicTX : ' + json.Topics.TX + '\n' +
            'TopicRX : ' + json.Topics.RX
          );
          navigation.navigate('TrackerNavigator', {
            token: token,
            navigation: navigation,
          });
          /* Sinon, affiche une erreur */
        } else {
          alert('There was an error when adding the tracker');
        }
      })
      /* Si l'API ne répond pas, affiche une erreur indiquant que l'API ne fonctionne pas */
      .catch((error) => {
        console.error(error);
        alert('API down');
      });
  }
};

/* Affiche la page d'ajout de traqueur
Reçoit en paramètre la variable 'navigation' */
function AddTrackerScreen({ route, navigation }) {
  const [trackerName, setTrackerName] = useState('');
  const { token } = route.params;

  /* Affiche des logs au lancement et à la 'destruction'*/
  useEffect(() => {
    console.log('');
    console.log('ADD TRACKER LOGS :');
    console.log('AddTrackerScreen token : ' + token);
    return () => {
      console.log('');
      console.log('TRACKER SCREEN LOGS :');
    };
  }, [token]);

  return (
    <View style={Styles.container}>
      <SafeAreaView>
        {/* Créé un champ qui met dans la variable 'trackerName' ce que saisi l'utilisateur */}
        <Text style={Styles.paragraph}>Tracker name</Text>
        <TextInput
          style={Styles.input}
          onChangeText={(text) => setTrackerName(text)}
          value={trackerName}
        />
      </SafeAreaView>
      {/* Créé qui va appeller la fonction 'AddTracker' */}
      <TouchableOpacity
        style={LoginStyles.addTrackerButton}
        onPress={() => AddTracker(token, trackerName, navigation)}>
        <Text style={LoginStyles.loginButtonText}>Add tracker</Text>
      </TouchableOpacity>
    </View>
  );
}

export default AddTrackerScreen;


```

## coordinatesScreen

``` js

import React, { Component, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

/* Importation des styles */
import Styles from './styles';

/* Paramètres de la class 'CoordinatesScreen' */
interface AppProps {
  navigation: any;
  trackerId: string;
  token: string;
}

/* Arguments de la class 'CoordinatesScreen' */
interface AppState {
  data: any[];
  date: String;
  latitude: String;
  longitude: String;
  latDelta: Int16Array;
  lonDelta: Int16Array;
  height: String;
  width: String;
  buttonTitle: String;
  color: String;
  zoomState: Bool;
}

/* Permet d'afficher les coordonnées d'un traqueur
Reçoit en paramètre le token de l'utilisateur, l'ID du traqueur sélectionné et la variable 'navigation' */
export default class CoordinatesScreen extends Component<AppProps, AppState> {
  state: AppState = {
    data: [],
    date: '',
    latitude: '',
    longitude: '',
    latDelta: 0.1,
    lonDelta: 0.1,
    height: '30%',
    width: '70%',
    buttonTitle: 'Extend',
    color: '#009688',
    zoomState: 0,
  };

  /* Style du bouton 'Extend' qui permet d'agrandir la carte
  Reçoit en paramètre la couleur du bouton (rouge pour activé, vert pour désactivé) */
  extend_button_style = function (a_color) {
    return {
      backgroundColor: a_color,
      borderRadius: 10,
      paddingVertical: 7,
      paddingHorizontal: 7,
      margin: 5,
      width: 90,
      alignSelf: 'center',
    };
  };

  /* Fonction qui va faire une requête à l'API en envoyant l'ID d'un traqueur afin de récupérer la dernière position
  enregistré de ce traqueur */
  async getPos() {
    try {
      /* Faire une requête à l'API en lui donnant l'ID d'un traqueur */
      const response = await fetch(
        'https://api.ovl.tech-user.fr/position/now/' + this.props.trackerId
      );
      /* Attend la réponse de l'API et la met en json dans la variable 'json' */
      const json = await response.json();
      console.log(json);
      /* Si il n'y a pas d'erreur, stock les données envoyées par l'API */
      if (json.error.Message == 'Nothing goes wrong.') {
        /* Met sous forme de date le timestamp reçu */
        var tempDate = new Date(Number(json.now.timestamp) * 1000);
        /* Formate la date pour la mettre sous la forme 'jj/mm/aaaa hh::mm::ss' */
        var formattedDate =
          ('0' + tempDate.getDate()).slice(-2) +
          '/' +
          ('0' + (tempDate.getMonth() + 1)).slice(-2) +
          '/' +
          tempDate.getFullYear() +
          ' ' +
          ('0' + tempDate.getHours()).slice(-2) +
          ':' +
          ('0' + tempDate.getMinutes()).slice(-2) +
          ':' +
          ('0' + tempDate.getSeconds()).slice(-2);
        console.log('Timestamp : ' + json.now.timestamp);
        console.log('Formatted date : ' + formattedDate);
        console.log('Latitude : ' + json.now.lat);
        console.log('Longitude : ' + json.now.lon);
        /* Stock la longitude, la latitude et la date de la dernière position enregistrée dans les atributs de la class*/
        this.setState({
          date: formattedDate,
          latitude: json.now.lat,
          longitude: json.now.lon,
        });
        /* Sinon, affiche une erreur */
      } else {
        alert('Erreur inconnu');
      }
    } catch (error) {
      /* Si l'API ne répond pas, affiche une erreur indiquant que l'API ne fonctionne pas */
      console.log(error);
      alert('API down');
    }
  }

  /* Appelle la fonction 'getPos' lorsque la class est créé */
  componentDidMount() {
    console.log('');
    console.log('COORDINATES SCREEN LOGS :');
    this.getPos();
  }

  /* Affiche des logs à la destruction de la class*/
  componentDidUnMount() {
    console.log('');
    console.log('TRACKER SCREEN LOGS :');
    this.getPos();
  }

  /* Zoom sur la carte */
  zoom() {
    if (this.state.zoomState == 0) {
      this.setState({
        latDelta: 0.008,
        lonDelta: 0.008,
        zoomState: 1,
      });
    } else {
      this.setState({
        latDelta: 0.1,
        lonDelta: 0.1,
        zoomState: 0,
      });
    }
    this.getPos();
  }

  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.coordinates}>
          {'Latitude : ' + this.state.latitude}
        </Text>
        <Text style={Styles.coordinates}>
          {'Longitude : ' + this.state.longitude}
        </Text>
        <Text style={Styles.coordinates}>
          {'Last update : ' + this.state.date}{' '}
        </Text>
        {/* Affiche la carte */}
        <MapView
          region={{
            latitude: Number(this.state.latitude),
            longitude: Number(this.state.longitude),
            latitudeDelta: this.state.latDelta,
            longitudeDelta: this.state.lonDelta,
          }}
          style={{
            width: this.state.width,
            height: this.state.height,
            alignSelf: 'center',
            margin: 10,
          }}>
          <Marker
            coordinate={{
              latitude: Number(this.state.latitude),
              longitude: Number(this.state.longitude),
              latitudeDelta: 0.1,
              longitudeDelta: 0.1,
            }}
          />
        </MapView>

        {/* Ligne numéro 1 des boutons (zoom+extend+refresh) */}
        <View style={Styles.mapButtonContainer}>
          {/* Zoom sur la carte */}
          <TouchableOpacity
            style={this.extend_button_style('#009688')}
            onPress={() => {
              this.zoom();
            }}>
            <Text style={Styles.mapButtonText}>Zoom</Text>
          </TouchableOpacity>
          {/* Agrandi/Rétréci la carte */}
          <TouchableOpacity
            style={this.extend_button_style(this.state.color)}
            onPress={() => {
              if (this.state.height == '72%') {
                this.setState({
                  height: '30%',
                  width: '70%',
                  color: '#009688',
                  buttonTitle: 'Extend',
                });
              } else {
                this.setState({
                  height: '72%',
                  width: '100%',
                  color: '#c61a09',
                  buttonTitle: 'Reduce',
                });
              }
            }}>
            <Text style={Styles.mapButtonText}>{this.state.buttonTitle}</Text>
          </TouchableOpacity>
          {/* Rafraichi la position sur la carte */}
          <TouchableOpacity
            style={this.extend_button_style('#009688')}
            onPress={() => {
              this.getPos();
            }}>
            <Text style={Styles.mapButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Ligne numéro 2 des boutons (settings+history) */}
        <View style={Styles.mapButtonContainer}>
          {/* Passe à la page de settings en en envoyant le token de l'utilisateur et l'ID du traqueur */}
          <TouchableOpacity
            style={this.extend_button_style('#77B5FE')}
            onPress={() => {
              this.props.navigation.navigate('SettingsNavigator', {
                trackerId: this.props.trackerId,
                token: this.props.token,
              });
            }}>
            <Text style={Styles.mapButtonText}>Settings</Text>
          </TouchableOpacity>
          {/* Passe à la page d'historique de position en envoyant l'ID du traqueur */}
          <TouchableOpacity
            style={this.extend_button_style('#77B5FE')}
            onPress={() => {
              this.props.navigation.navigate('HistoryNavigator', {
                trackerId: this.props.trackerId,
              });
            }}>
            <Text style={Styles.mapButtonText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}


```

## historyScreen

``` js

import React, { Component, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

/* Importation des styles */
import Styles from './styles';
import HistoryStyles from './historyStyles';

/* Paramètres de la class 'HistoryScreen' */
interface AppProps {
  trackerId: string;
}

/* Arguments de la class 'HistoryScreen' */
interface AppState {
  data: String[];
  date: String[];
  hour: String[];
}

/* Permet d'afficher l'historique de position d'un traqueur
Reçoit en paramètre l'ID d'un traqueur */
export default class HistoryScreen extends Component<AppProps, AppState> {
  state: AppState = {
    data: [],
    date: [],
    hour: [],
  };

  /* Fonction qui va faire une requête à l'API en lui donnant l'ID d'un traqueur afin de
  récupérer toutes les positions du traqueur enregistrées les dernières 48 heures */
  async getHistory() {
    try {
      /* Faire une requête à l'API en lui donnant le token l'utilisateur */
      const response = await fetch(
        'https://api.ovl.tech-user.fr/position/history/' + this.props.trackerId
      );
      /* Attend la réponse de l'API et la met en json dans la variable 'json' */
      const json = await response.json();
      console.log(json);
      /* Si il n'y a pas d'erreur, stock les données envoyées par l'API */
      if (json.error.Message == 'Nothing goes wrong.') {
        console.log(
          "Nombre de position dans l'historique : " + json.history.length
        );
        var hour = [];
        var date = [];
        /* Boucle le nombre de fois qu'il y a de position dans l'historique */
        for (var i = 0; i < json.history.length; i++) {
          /* Met sous forme de date le timestamp reçu */
          var tempDate = new Date(Number(json.history[i].timestamp) * 1000);
          /* Formate la date pour la mettre sous la forme 'jj/mm/aaaa' */
          date[i] =
            ('0' + tempDate.getDate()).slice(-2) +
            '/' +
            ('0' + (tempDate.getMonth() + 1)).slice(-2) +
            '/' +
            tempDate.getFullYear();
          /* Formate l'heure pour la mettre sous la forme 'hh::mm::ss' */
          hour[i] =
            ('0' + tempDate.getHours()).slice(-2) +
            ':' +
            ('0' + tempDate.getMinutes()).slice(-2) +
            ':' +
            ('0' + tempDate.getSeconds()).slice(-2);
        }
        /* Stock dans les atributs de la class la date, l'heure et l'historique de position */
        this.setState({
          data: json.history,
          date: date,
          hour: hour,
        });
        /* Sinon affiche une erreur */
      } else {
        alert('Erreur inconnu');
      }
    } catch (error) {
      /* Si l'API ne répond pas, affiche une erreur indiquant que l'API ne fonctionne pas */
      console.log(error);
      alert('API down');
    }
  }

  /* Appelle la fonction 'getHistory' lorsque la class est créé */
  componentDidMount() {
    console.log('');
    console.log('HISTORY SCREEN LOGS :');
    this.getHistory();
  }

  /* Affiche des logs à la destruction de la class */
  componentDidUnMount() {
    console.log('');
    console.log('COORDINATES SCREEN LOGS :');
  }

  render() {
    return (
      <View style={Styles.container}>
        <View style={HistoryStyles.row}>
          <View style={HistoryStyles.col}>
            <Text style={HistoryStyles.historyParagraph}>Latitude</Text>
          </View>
          <View style={HistoryStyles.col}>
            <Text style={HistoryStyles.historyParagraph}>Longitude</Text>
          </View>
          <View style={HistoryStyles.col}>
            <Text style={HistoryStyles.historyParagraph}>Date</Text>
          </View>
          <View style={HistoryStyles.col}>
            <Text style={HistoryStyles.historyParagraph}>Heure</Text>
          </View>
        </View>

        <View style={HistoryStyles.row}>
          {/* Affiche les latitudes */}
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={HistoryStyles.col}>
                <Text style={HistoryStyles.historyParagraph}>{item.lat}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Affiche les longitudes */}
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={HistoryStyles.col}>
                <Text style={HistoryStyles.historyParagraph}>{item.lon}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Affiche les dates */}
          <FlatList
            data={this.state.date}
            renderItem={({ item }) => (
              <View style={HistoryStyles.col}>
                <Text style={HistoryStyles.historyParagraph}>{item}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Affiche les heures */}
          <FlatList
            data={this.state.hour}
            renderItem={({ item }) => (
              <View style={HistoryStyles.col}>
                <Text style={HistoryStyles.historyParagraph}>{item}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    );
  }
}


```

## settingsScreen

``` js

import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ProgressBar } from 'react-native-paper';

/* Importation des styles */
import Styles from './styles';

/* Attributs de la class 'SettingsScreen' */
interface AppState {
  data: any[];
  statusCharge: Boolean;
  statusBat: String;
  statusAlarm: Boolean;
  statusOnline: Boolean;
  statusEcomode: Boolean;
  statusProtection: Boolean;
  statusVhCharge: Boolean;
  statusGPS: Boolean;
  ecoChanged: String;
  protectionChanged: String;
  batteryChargeColor: String;
}

/* Paramètres de la class 'SettingsScreen' */
interface AppProps {
  trackerId: String;
  token: String;
}

/* Affiche la page affichant les statuts du traqueur et les paramètres changeables
Reçoit l'ID d'un traqueur et la variable navigation */
export default class SettingsScreen extends Component<AppState, AppProps> {
  state: AppState = {
    data: [],
    statusCharge: 0,
    statusBat: '0',
    statusAlarm: 0,
    statusOnline: 0,
    statusEcomode: 0,
    statusProtection: 0,
    statusVhCharge: 0,
    statusGPS: 0,
    ecoChanged: '',
    protectionChanged: '',
    batteryChargeColor: '#c61a09',
  };

  /* Style pour les statuts et paramètres du traqueur (rouge pour désactivé, vert pour activé) 
  Reçoit en paramètre un booléen indiquant si le statut/paramètre est activé ou non */
  status_style = function (state) {
    var a_color = '#c61a09';
    /* Si le statut/paramètre est activé, met le bouton en vert */
    if (state == 1) {
      a_color = '#22844e';
    }
    return {
      marginTop: 10,
      paddingVertical: 8,
      borderRadius: 6,
      backgroundColor: a_color,
      textAlign: 'center',
      fontSize: 16,
      fontWeight: 'bold',
      alignSelf: 'center',
      width: 135,
    };
  };

  /* Change le statut (activé/désactivé) du paramètre 'EcoMode'  (ne l'applique pas) */
  changeEcoSettings = () => {
    /* Si le paramètre n'a pas été changé, met une étoile devant le paramètre 'EcoMode' indiquant le changement */
    if (this.state.ecoChanged == '') {
      /* Si le statut était désactivé, l'active*/
      if (this.state.statusEcomode == 0) {
        this.setState({
          ecoChanged: '*',
          statusEcomode: 1,
        });
        /* Sinon, le désactive */
      } else {
        this.setState({
          ecoChanged: '*',
          statusEcomode: 0,
        });
      }
      /* Si la paramètre a déjà été changé, enlève l'étoile */
    } else {
      if (this.state.statusEcomode == 0) {
        this.setState({
          ecoChanged: '',
          statusEcomode: 1,
        });
      } else {
        this.setState({
          ecoChanged: '',
          statusEcomode: 0,
        });
      }
    }
  };

  /* Change le statut (activé/désactivé) du paramètre 'Protection'  (ne l'applique pas) */
  changeProtectionSettings = () => {
    /* Si le paramètre n'a pas été changé, met une étoile devant le paramètre 'Protection' indiquant le changement */
    if (this.state.protectionChanged == '') {
      /* Si le statut était désactivé, l'active*/
      if (this.state.statusProtection == 0) {
        this.setState({
          protectionChanged: '*',
          statusProtection: 1,
        });
        /* Sinon, le désactive */
      } else {
        this.setState({
          protectionChanged: '*',
          statusProtection: 0,
        });
      }
      /* Si la paramètre a déjà été changé, enlève l'étoile */
    } else {
      if (this.state.statusProtection == 0) {
        this.setState({
          protectionChanged: '',
          statusProtection: 1,
        });
      } else {
        this.setState({
          protectionChanged: '',
          statusProtection: 0,
        });
      }
    }
  };

  /* Applique les settings changés
  Reçoit en paramètre l'ID d'un traqueur ainsi que le statut de l'alarm, du mode économique, de la protection et de la charge du véhicule */
  putSettings = (trackerId, alarm, ecoMode, protection, vhCharge) => {
    /* Réinitialise les statuts de changement */
    this.setState({
      ecoChanged: '',
      protectionChanged: '',
    });
    /* Fait une requête à l'API pour changer les paramètres du traqueur */
    fetch('https://api.ovl.tech-user.fr/set/status/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      /* Envoie l'ID du traqueur et le statut de chaque paramètre */
      body: JSON.stringify({
        id_iot: trackerId,
        status_alarm: alarm,
        status_ecomode: ecoMode,
        status_protection: protection,
        status_vh_charge: vhCharge,
      }),
    })
      /* Récupère la réponse de l'API */
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        /* Si le changement s'est bien effectué, affiche que ça s'est bien effectué */
        if (json.error.Message == 'Nothing goes wrong.') {
          alert('Changement appliqués !');
        } else {
          alert("Erreur lors de l'application des changements.");
        }
      })
      .catch((error) => {
        /* Si l'API ne répond pas, affiche une erreur indiquant que l'API ne fonctionne pas */
        console.log(error);
        alert('API down');
      });
  };

  /* Fonction qui va faire une requête à l'API en envoyant le token de l'utilisateur afin de recevoir les statuts de son traqueur */
  async getStatus() {
    try {
      /* Réinitialise les statuts/paramètres du traqueur dans la class */
      this.setState({
        data: [],
        statusCharge: 0,
        statusBat: '0',
        statusAlarm: 0,
        statusOnline: 0,
        statusEcomode: 0,
        statusProtection: 0,
        statusVhCharge: 0,
        statusGPS: 0,
        ecoChanged: '',
        protectionChanged: '',
      });
      /* Fait le requête à l'API en envoyant le token de l'utilisateur */
      const response = await fetch(
        'https://api.ovl.tech-user.fr/status_list/' + this.props.token
      );
      /* Récupère la réponse dans la variable 'json' */
      const json = await response.json();
      /* Met dans 'data' le json */
      this.setState({
        data: json.status_list[this.props.trackerId - 1],
      });
      console.log(json.status_list[this.props.trackerId - 1]);

      this.setState({
        statusBat: json.status_list[this.props.trackerId - 1].status_bat,
      });

      /* Si la charge de la batterie est supérieur à 60%, change la couleur de la barre de charge en vert */
      if (Number(json.status_list[this.props.trackerId - 1].status_bat) > 60) {
        this.setState({
          batteryChargeColor: '#096A09',
        });
        /* Si la charge de la batterie est inférieur à 30%, change la couleur de la barre de charge en rouge */
      } else if (
        Number(json.status_list[this.props.trackerId - 1].status_bat) < 30
      ) {
        this.setState({
          batteryChargeColor: '#c61a09',
        });
        /* Sinon, la met en orange */
      } else {
        this.setState({
          batteryChargeColor: '#ff7f00',
        });
      }
      statusBat = json.status_list[this.props.trackerId - 1].status_bat;

      /* Pour chaque 'if(...)', initialise les statuts du traqueur dans la classe pour mettre ceux reçu par l'API */
      if (json.status_list[this.props.trackerId - 1].status_charge == 1) {
        this.setState({
          statusCharge: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_alarm == 1) {
        this.setState({
          statusAlarm: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_ecomode == 1) {
        this.setState({
          statusEcomode: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_online == 1) {
        this.setState({
          statusOnline: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_protection == 1) {
        this.setState({
          statusProtection: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_gps == 1) {
        this.setState({
          statusGPS: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_vh_charge == 1) {
        this.setState({
          status_vh_charge: 1,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* Lance la fonction 'getStatus' à la création de la class */
  componentDidMount() {
    console.log('');
    console.log('SETTINGS SCREEN LOGS :');
    this.getStatus();
  }

  /* Affiche des logs à la destruction de la class */
  componentDidUnMount() {
    console.log('');
    console.log('COORDINATES SCREEN LOGS :');
  }

  render() {
    return (
      <View style={Styles.container}>
        {/* Réappelle la fonction 'getStatus' pour rafraichir les statuts */}
        <TouchableOpacity
          style={Styles.settingsButtonContainer}
          onPress={() => {
            this.getStatus();
          }}>
          <Text style={Styles.buttonText}>{'Refresh'}</Text>
        </TouchableOpacity>
        {/* Applique les paramètres changés */}
        <TouchableOpacity
          style={Styles.settingsButtonContainer}
          onPress={() => {
            this.putSettings(
              this.props.trackerId,
              this.state.statusAlarm,
              this.state.statusEcomode,
              this.state.statusProtection,
              this.state.statusVhCharge
            );
          }}>
          <Text style={Styles.buttonText}>{'Apply Settings'}</Text>
        </TouchableOpacity>

        <Text style={Styles.listText}>
          {'Battery charge (' + this.state.statusBat + '%) :'}
        </Text>
        <ProgressBar
          progress={Number(this.state.statusBat) / 100}
          color={this.state.batteryChargeColor}
          style={Styles.batteryBar}
        />

        {/* Affiche les statuts du traqueur */}
        <Text style={Styles.listText}>{'Tracker status :'}</Text>
        <Text style={this.status_style(this.state.data.status_vh_charge)}>
          {'In charge'}
        </Text>

        <Text style={this.status_style(this.state.data.status_online)}>
          {'Is connected'}
        </Text>

        <Text style={this.status_style(this.state.data.status_vh_charge)}>
          {'Vehicule charge'}
        </Text>

        <Text style={this.status_style(this.state.data.status_gps)}>
          {'GPS'}
        </Text>

        <Text style={this.status_style(this.state.data.status_alarm)}>
          {'Alarm'}
        </Text>

        {/* Affiche le statut des paramètres du traqueur */}
        <Text style={Styles.listText}>{'Tracker settings :'}</Text>

        {/* Pour chaque paramètre, change dans la class le statut du paramètre lorsque le boutton est appuyé */}
        <TouchableOpacity
          style={this.status_style(this.state.statusEcomode)}
          onPress={() => {
            this.changeEcoSettings();
          }}>
          <Text style={Styles.buttonText}>
            {this.state.ecoChanged + ' Eco mode'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={this.status_style(this.state.statusProtection)}
          onPress={() => {
            this.changeProtectionSettings();
          }}>
          <Text style={Styles.buttonText}>
            {this.state.protectionChanged + ' Protection'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}


```

## styles

``` js

import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

/* Créé les styles généraux */
export default Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#e4eded',
    padding: 8,
  },
  paragraph: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    backgroundColor: '#c8cfcf',
    padding: 10,
    borderRadius: 10,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  coordinates: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 125,
    margin: 10,
    width: 150,
    alignSelf: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: 20,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
  },
  text: {
    flex: 1,
  },
  text2: {
    flex: 2,
  },
  settingsButtonContainer: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 125,
    margin: 10,
    width: 250,
    alignSelf: 'center',
  },
  listText: {
    fontSize: 22,
    color: '#000000',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 15,
  },
  mapButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButtonOpacity: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 7,
    margin: 5,
    width: 75,
    alignSelf: 'center',
  },
  mapButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  batteryBar: {
    width: 300,
    height: 15,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
});


```

## loginStyles

``` js

import { StyleSheet } from 'react-native';

/* Créé les styles pour la page 'loginScreen' */
export default LoginStyles = StyleSheet.create({
  appButtonContainer: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 125,
    margin: 10,
    width: 150,
    alignSelf: 'center',
  },
  loginButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  loginButton: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 7,
    margin: 5,
    marginHorizontal: 35,
    width: 100,
    alignSelf: 'center',
  },
  addTrackerButton: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 7,
    margin: 10,
    marginHorizontal: 35,
    width: 290,
    alignSelf: 'center',
  },
});


```

## historyStyles

``` js

import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

/* Créé les styles pour la page 'historyScreen' */
export default HistoryStyles = StyleSheet.create({
  app: {
    flex: 4, // the number of columns you want to devide the screen into
    marginHorizontal: 'auto',
    width: 400,
    backgroundColor: 'red',
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    backgroundColor: 'lightblue',
    borderColor: '#fff',
    borderWidth: 1,
    flex: 1,
    width: 325,
  },
  historyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#e4eded',
    padding: 8,
  },
  historyParagraph: {
    margin: 3,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});


```

## trackerStyles

``` js

import { StyleSheet } from 'react-native';

/* Créé les styles pour la page 'trackerScreen' */
export default TrackerStyles = StyleSheet.create({
  listText: {
    fontSize: 30,
    color: '#000000',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  addTrackerButtonContainer: {
    backgroundColor: '#0f056b',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 125,
    margin: 10,
    width: 300,
    alignSelf: 'center',
  },
  trackerButtonContainer: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 125,
    width: 200,
    alignSelf: 'center',
  },
  appButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
  },
});


```