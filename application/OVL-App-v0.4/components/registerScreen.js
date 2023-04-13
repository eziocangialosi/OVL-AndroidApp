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
const Register = (email, password, confirmPassword, navigation) => {
  /* Si l'utilisateur n'a rien saisi dans un des champs, affiche une erreur */
  if (email == '' || password == '' || confirmPassword == '') {
    alert('Please enter information in the fields');
  } 
  /* Si l'utilisateur n'a pas saisi le même mot de passe */
  else if (password !== confirmPassword) {
    alert('Passwords fields haven\'t the same information');
  }
  else {
    /* Sinon, fait une requête 'POST' à l'API en envoyant le token de l'utilisateur et le nom du traqueur qui a été sélectionné */
    fetch('https://ovl.tech-user.fr:6969/user/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      /* Données envoyées à l'API */
      body: JSON.stringify({
        mail: email,
        password: password,
      }),
    })
      /* Récupère la réponse de l'API */
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        /* Si il n'y a pas eu d'erreur, envoie l'utilisateur à la page de login et affiche un succès d'inscription */
        if (json.error.Message == 'Nothing goes wrong.') {
          alert('Registration has been successfully completed');
          navigation.goBack();
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
function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');

  /* Affiche des logs au lancement et à la 'destruction'*/
  useEffect(() => {
    console.log('');
    console.log('REGISTER LOGS :');
  }, []);

  return (
    <View style={Styles.container}>
      {/* Créé un champ qui met dans la variable 'email' ce que saisi l'utilisateur */}
      <Text style={Styles.paragraph}>Email</Text>
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
        onPress={() => Register(email, password, confirmPassword, navigation)}>
        <Text style={LoginStyles.loginButtonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

export default RegisterScreen;
