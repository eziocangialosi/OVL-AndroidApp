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
    fetch('https://ovl.tech-user.fr:6969/iot', {
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