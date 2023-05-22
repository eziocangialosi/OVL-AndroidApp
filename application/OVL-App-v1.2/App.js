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
