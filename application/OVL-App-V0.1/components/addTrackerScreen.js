import React, { useState } from 'react';
import { View, Button, Text, SafeAreaView, TextInput } from 'react-native';

/* Importation des styles pour les éléments de l'interface */
import Styles from './styles';

const AddTracker = (token, trackerName, navigation) => {
  fetch('https://ovl.tech-user.fr:6969/iot/', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token: token,
      name: trackerName,
    }),
  })
    .then((response) => response.json())
    .then((json) => {
      console.log(json);
      navigation.navigate('TrackerNavigator', {token: token, navigation: navigation});
    })
    .catch((error) => {
      console.error(error);
    });
};

function AddTrackerScreen({ route, navigation }) {
  const [trackerName, setTrackerName] = useState('');
  const { token } = route.params;
  return (
    <View style={Styles.container}>
      <SafeAreaView>
        {/* Créé le champ 'nom du tracker' : lorsque l'utilisateur écrit quelque chose dedans, le met dans la variable 'trackerName' */}
        <Text style={Styles.paragraph}>Nom du tracker</Text>
        <TextInput
          style={Styles.input}
          onChangeText={(text) => setTrackerName(text)}
          value={trackerName}
        />
      </SafeAreaView>
      {/* Créé un bouton de connexion qui va appeller la fonction 'getToken' */}
      <Button title="Ajouter le tracker" onPress={() => AddTracker(token, trackerName, navigation)} />
    </View>
  );
}

export default AddTrackerScreen;