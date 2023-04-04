import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
} from 'react-native';

/* Importation des styles pour les éléments de l'interface */
import Styles from './styles';
import LoginStyles from './loginStyles';

/* Fonction qui permet d'afficher la page de connexion et d'intéragir avec elle :
- Elle reçoit en paramètre la variable 'navigation' permettant de changer de fenêtre */
const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  /* Fonction qui va faire une requête à l'API en envoyant l'email et le mot de passe saisi par l'utilisateur afin de
  recevoir le token de l'utilisateur */
  const getToken = async () => {
    try {
      /* Fait une réquête à l'API en lui donnant l'email et le mot de passe saisi par l'utilisateur */
      const response = await fetch(
        'https://ovl.tech-user.fr:6969/user/' + email + '/' + password
      );
      /* Attend la réponse de l'API et la met en json dans la variable 'json' */
      const json = await response.json();
      /* Si il n'y a pas d'erreur, change la fenêtre de navigation pour celle de selection du tracker
      et envoie à la classe qui s'occupe de son affichage le token de l'utilisateur  */
      if (json.error.Message == 'Nothing goes wrong.') {
        console.log(navigation.toString());
        console.log('LoginScreen token : ' + json.user);
        navigation.navigate('TrackerNavigator', {
          token: json.user,
          navigation: navigation,
        });
        /* Sinon, affiche un message d'erreur. */
      } else {
        alert("Nom d'utilisateur ou mot de passe incorrect.");
      }
    } catch (error) {
      console.log(error);
      alert('API down');
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
          placeholder={'test@gmail.com'}
        />
        {/* Créé le champ 'password' : lorsque l'utilisateur écrit quelque chose dedans, le met dans la variable 'password' */}
        <Text style={Styles.paragraph}>Password</Text>
        <TextInput
          style={Styles.input}
          onChangeText={(text) => setPassword(text)}
          value={password}
          placeholder={'mdp'}
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
