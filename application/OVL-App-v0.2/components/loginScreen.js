import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';

/* Importation des styles */
import Styles from './styles';
import LoginStyles from './loginStyles';

/* Fonction qui permet d'afficher la page de connexion et d'intéragir avec elle
Reçoit en paramètre la variable 'navigation' permettant de changer de page */
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* Fonction qui va faire une requête à l'API en envoyant l'email et le mot de passe saisi par l'utilisateur afin de
  recevoir son token */
  const getToken = async () => {
    /* Si il y a au moins 1 champ vide, affiche une erreur */
    if (email == '' || password == '') {
      alert('Veuillez saisir des informations dans les champs.');
    } else {
      try {
        console.log('LOGIN SCREEN LOGS :');
        console.log('Email : ' + email);
        console.log('Password : ' + password);
        /* Fait une réquête à l'API en lui donnant l'email et le mot de passe saisi par l'utilisateur */
        const response = await fetch(
          'https://ovl.tech-user.fr:6969/user/' + email + '/' + password
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
        <Text style={Styles.paragraph}>Email</Text>
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
      {/* Créé un bouton de connexion qui va appeller la fonction 'getToken' */}
      <TouchableOpacity
        style={LoginStyles.appButtonContainer}
        onPress={() => getToken()}>
        <Text style={LoginStyles.appButtonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
