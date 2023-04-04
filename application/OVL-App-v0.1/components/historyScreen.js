import React, { Component, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

/* Importation des styles pour les éléments de l'interface */
import Styles from './styles';
import HistoryStyles from './historyStyles';

interface AppProps {
  trackerId: string;
}

interface AppState {
  data: String[];
  date: String[];
  hour: String[];
}

export default class HistoryScreen extends Component<AppProps, AppState> {
  state: AppState = {
    data: [],
    date: [],
    hour: [],
  };

  /* Fonction qui va faire une requête à l'API en lui donnant le token de l'utilisateur afin de
  récupérer l'id et le nom des trackers */
  async getHistory() {
    try {
      /* Faire une requête à l'API en lui donnant le token l'utilisateur */
      const response = await fetch(
        'https://ovl.tech-user.fr:6969/position/history/' + this.props.trackerId
      );
      /* Attend la réponse de l'API et la met en json dans la variable 'json' */
      const json = await response.json();
      console.log(json);
      var hour = [];
      var date = [];
      for (var i = 0; i < json.history.length; i++) {
        var temp = new Date(Number(json.history[i].timestamp) * 1000);
        date[i] =
          ('0' + temp.getDate()).slice(-2) +
          '/' +
          ('0' + (temp.getMonth() + 1)).slice(-2) +
          '/' +
          temp.getFullYear();
        hour[i] =
          ('0' + temp.getHours()).slice(-2) +
          ':' +
          ('0' + temp.getMinutes()).slice(-2) +
          ':' +
          ('0' + temp.getSeconds()).slice(-2);
      }
      console.log(json.history[0].lon);
      this.setState({
        data: json.history,
        date: date,
        hour: hour,
      });
    } catch (error) {
      console.log(error);
    }
  }

  /* Appelle la fonction 'getTrackers' lorsque l'objet de la classe est créé */
  componentDidMount() {
    this.getHistory();
  }
  render() {
    return (
      <View style={Styles.container}>
        <View style={HistoryStyles.row}>
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={HistoryStyles.col}>
                <Text style={HistoryStyles.historyParagraph}>{item.lat}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={HistoryStyles.col}>
                <Text style={HistoryStyles.historyParagraph}>{item.lon}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
          <FlatList
            data={this.state.date}
            renderItem={({ item }) => (
              <View style={HistoryStyles.col}>
                <Text style={HistoryStyles.historyParagraph}>{item}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
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
