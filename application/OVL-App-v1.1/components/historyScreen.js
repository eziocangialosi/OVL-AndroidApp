import React, { Component, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

/* Importation des styles */
import Styles from './styles';
import HistoryStyles from './historyStyles';

/* Paramètres de la class 'HistoryScreen' */
interface AppProps {
  trackerId: string;
}

/* Arguments de la class 'HistoryScreen' */
interface AppState {
  data: String[];
  date: String[];
  hour: String[];
}

/* Permet d'afficher l'historique de position d'un traqueur
Reçoit en paramètre l'ID d'un traqueur */
export default class HistoryScreen extends Component<AppProps, AppState> {
  state: AppState = {
    data: [],
    date: [],
    hour: [],
  };

  /* Fonction qui va faire une requête à l'API en lui donnant l'ID d'un traqueur afin de
  récupérer toutes les positions du traqueur enregistrées les dernières 48 heures */
  async getHistory() {
    try {
      /* Faire une requête à l'API en lui donnant le token l'utilisateur */
      const response = await fetch(
        'https://api.ovl.tech-user.fr/position/history/' + this.props.trackerId
      );
      /* Attend la réponse de l'API et la met en json dans la variable 'json' */
      const json = await response.json();
      console.log(json);
      /* Si il n'y a pas d'erreur, stock les données envoyées par l'API */
      if (json.error.Message == 'Nothing goes wrong.') {
        console.log(
          "Nombre de position dans l'historique : " + json.history.length
        );
        var hour = [];
        var date = [];
        /* Boucle le nombre de fois qu'il y a de position dans l'historique */
        for (var i = 0; i < json.history.length; i++) {
          /* Met sous forme de date le timestamp reçu */
          var tempDate = new Date(Number(json.history[i].timestamp) * 1000);
          /* Formate la date pour la mettre sous la forme 'jj/mm/aaaa' */
          date[i] =
            ('0' + tempDate.getDate()).slice(-2) +
            '/' +
            ('0' + (tempDate.getMonth() + 1)).slice(-2) +
            '/' +
            tempDate.getFullYear();
          /* Formate l'heure pour la mettre sous la forme 'hh::mm::ss' */
          hour[i] =
            ('0' + tempDate.getHours()).slice(-2) +
            ':' +
            ('0' + tempDate.getMinutes()).slice(-2) +
            ':' +
            ('0' + tempDate.getSeconds()).slice(-2);
        }
        /* Stock dans les atributs de la class la date, l'heure et l'historique de position */
        this.setState({
          data: json.history,
          date: date,
          hour: hour,
        });
        /* Sinon affiche une erreur */
      } else {
        alert('Erreur inconnu');
      }
    } catch (error) {
      /* Si l'API ne répond pas, affiche une erreur indiquant que l'API ne fonctionne pas */
      console.log(error);
      alert('API down');
    }
  }

  /* Appelle la fonction 'getHistory' lorsque la class est créé */
  componentDidMount() {
    console.log('');
    console.log('HISTORY SCREEN LOGS :');
    this.getHistory();
  }

  /* Affiche des logs à la destruction de la class */
  componentDidUnMount() {
    console.log('');
    console.log('COORDINATES SCREEN LOGS :');
  }

  render() {
    return (
      <View style={Styles.container}>
        <View style={HistoryStyles.row}>
          <View style={HistoryStyles.col}>
            <Text style={HistoryStyles.historyParagraph}>Latitude</Text>
          </View>
          <View style={HistoryStyles.col}>
            <Text style={HistoryStyles.historyParagraph}>Longitude</Text>
          </View>
          <View style={HistoryStyles.col}>
            <Text style={HistoryStyles.historyParagraph}>Date</Text>
          </View>
          <View style={HistoryStyles.col}>
            <Text style={HistoryStyles.historyParagraph}>Heure</Text>
          </View>
        </View>

        <View style={HistoryStyles.row}>
          {/* Affiche les latitudes */}
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={HistoryStyles.col}>
                <Text style={HistoryStyles.historyParagraph}>{item.lat}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Affiche les longitudes */}
          <FlatList
            data={this.state.data}
            renderItem={({ item }) => (
              <View style={HistoryStyles.col}>
                <Text style={HistoryStyles.historyParagraph}>{item.lon}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Affiche les dates */}
          <FlatList
            data={this.state.date}
            renderItem={({ item }) => (
              <View style={HistoryStyles.col}>
                <Text style={HistoryStyles.historyParagraph}>{item}</Text>
              </View>
            )}
            keyExtractor={(item) => item.id}
          />

          {/* Affiche les heures */}
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
