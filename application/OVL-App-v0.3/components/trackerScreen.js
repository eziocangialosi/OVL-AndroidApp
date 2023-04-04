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
        'https://ovl.tech-user.fr:6969/iot_list/' + this.props.token
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
