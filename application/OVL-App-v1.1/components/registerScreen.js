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
  if (email == '' || password == '' || confirmPassword == '') {
    alert('Please enter information in the fields');
  } else if (password !== confirmPassword) {
    /* Si l'utilisateur n'a pas saisi le même mot de passe */
    alert("Passwords fields haven't the same information");
  } else if (/@/g.test(email) == 0 || / /g.test(email) == 1 || email.length > 255) {
    alert('Please enter correct email in the field');
  } else if (/ /g.test(password) == 1) {
    alert("Please don't put a space in the password field");
  } else if (password.length < 8 || password.length > 24) {
    alert('Please enter a password between 8 and 24 characters');
  } else {
    /* Sinon, fait une requête 'POST' à l'API en envoyant le token de l'utilisateur et le nom du traqueur qui a été sélectionné */
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
