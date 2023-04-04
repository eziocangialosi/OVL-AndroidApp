import React, { useState, useEffect } from 'react';
import { View, Button, Text, SafeAreaView, TextInput } from 'react-native';

/* Importation des styles */
import Styles from './styles';

/* Permet de faire une requête à l'API pour ajouter un traqueur
Reçoit en paramètre le token de l'utilisateur, le nom de son traqueur et la variable 'navigation' */
const AddTracker = (token, trackerName, navigation) => {
  /* Si l'utilisateur n'a pas saisi le nom de son nouveau traqueur, affiche une erreur */
  if (trackerName == '') {
    alert('Veuillez saisir le nom du traqueur dans le champ spécififé.');
  } else {
    /* Sinon, fait une requête 'PUT' à l'API en envoyant le token de l'utilisateur et le nom du traqueur qui a été sélectionné */
    fetch('https://ovl.tech-user.fr:6969/iot/', {
      method: 'PUT',
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
        /* Si il n'y a pas eu d'erreur, envoie l'utilisateur à la page de sélction des traqueurs en renvoyant le token */
        if (json.error.Message == 'Nothing goes wrong.')
          navigation.navigate('TrackerNavigator', {
            token: token,
            navigation: navigation,
          });
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
        <Text style={Styles.paragraph}>Nom du tracker</Text>
        <TextInput
          style={Styles.input}
          onChangeText={(text) => setTrackerName(text)}
          value={trackerName}
        />
      </SafeAreaView>
      {/* Créé qui va appeller la fonction 'AddTraqueur' */}
      <Button
        title="Ajouter le tracker"
        onPress={() => AddTracker(token, trackerName, navigation)}
      />
    </View>
  );
}

export default AddTrackerScreen;
