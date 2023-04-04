import React, { Component, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

/* Importation des styles */
import Styles from './styles';

/* Paramètres de la class 'CoordinatesScreen' */
interface AppProps {
  navigation: any;
  trackerId: string;
  token: string;
}

/* Arguments de la class 'CoordinatesScreen' */
interface AppState {
  data: any[];
  date: String;
  latitude: String;
  longitude: String;
  height: String;
  width: String;
  buttonTitle: String;
  color: String;
}

/* Permet d'afficher les coordonnées d'un traqueur
Reçoit en paramètre le token de l'utilisateur, l'ID du traqueur sélectionné et la variable 'navigation' */
export default class CoordinatesScreen extends Component<AppProps, AppState> {
  state: AppState = {
    data: [],
    date: '',
    latitude: '',
    longitude: '',
    height: '30%',
    width: '70%',
    buttonTitle: 'Extend',
    color: '#009688',
  };

  /* Style du bouton 'Extend' qui permet d'agrandir la carte
  Reçoit en paramètre la couleur du bouton (rouge pour activé, vert pour désactivé) */
  extend_button_style = function (a_color) {
    return {
      backgroundColor: a_color,
      borderRadius: 10,
      paddingVertical: 7,
      paddingHorizontal: 7,
      margin: 5,
      width: 75,
      alignSelf: 'center',
    };
  };

  /* Fonction qui va faire une requête à l'API en envoyant l'ID d'un traqueur afin de récupérer la dernière position
  enregistré de ce traqueur */
  async getPos() {
    try {
      /* Faire une requête à l'API en lui donnant l'ID d'un traqueur */
      const response = await fetch(
        'https://ovl.tech-user.fr:6969/position/now/' + this.props.trackerId
      );
      /* Attend la réponse de l'API et la met en json dans la variable 'json' */
      const json = await response.json();
      console.log(json);
      /* Si il n'y a pas d'erreur, stock les données envoyées par l'API */
      if (json.error.Message == 'Nothing goes wrong.') {
        /* Met sous forme de date le timestamp reçu */
        var tempDate = new Date(Number(json.now.timestamp) * 1000);
        /* Formate la date pour la mettre sous la forme 'jj/mm/aaaa hh::mm::ss' */
        var formattedDate =
          ('0' + tempDate.getDate()).slice(-2) +
          '/' +
          ('0' + (tempDate.getMonth() + 1)).slice(-2) +
          '/' +
          tempDate.getFullYear() +
          ' ' +
          ('0' + tempDate.getHours()).slice(-2) +
          ':' +
          ('0' + tempDate.getMinutes()).slice(-2) +
          ':' +
          ('0' + tempDate.getSeconds()).slice(-2);
        console.log('Timestamp : ' + json.now.timestamp);
        console.log('Formatted date : ' + formattedDate);
        console.log('Latitude : ' + json.now.lat);
        console.log('Longitude : ' + json.now.lon);
        /* Stock la longitude, la latitude et la date de la dernière position enregistrée dans les atributs de la class*/
        this.setState({
          date: formattedDate,
          latitude: json.now.lat,
          longitude: json.now.lon,
        });
        /* Sinon, affiche une erreur */
      } else {
        alert('Erreur inconnu');
      }
    } catch (error) {
      /* Si l'API ne répond pas, affiche une erreur indiquant que l'API ne fonctionne pas */
      console.log(error);
      alert('API down');
    }
  }

  /* Appelle la fonction 'getPos' lorsque la class est créé */
  componentDidMount() {
    console.log('');
    console.log('COORDINATES SCREEN LOGS :');
    this.getPos();
  }

  /* Affiche des logs à la destruction de la class*/
  componentDidUnMount() {
    console.log('');
    console.log('TRACKER SCREEN LOGS :');
    this.getPos();
  }

  render() {
    return (
      <View style={Styles.container}>
        <Text style={Styles.coordinates}>
          {'Latitude : ' + this.state.latitude}
        </Text>
        <Text style={Styles.coordinates}>
          {'Longitude : ' + this.state.longitude}
        </Text>
        <Text style={Styles.coordinates}>
          {'Last update : ' + this.state.date}{' '}
        </Text>
        {/* Affiche la carte */}
        <MapView
          region={{
            latitude: Number(this.state.latitude),
            longitude: Number(this.state.longitude),
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
          style={{
            width: this.state.width,
            height: this.state.height,
            alignSelf: 'center',
          }}></MapView>

        {/* Ligne numéro 1 des boutons (zoom+extend+refresh) */}
        <View style={Styles.mapButtonContainer}>
          {/* Zoom sur la carte */}
          <TouchableOpacity style={this.extend_button_style('#009688')}>
            <Text style={Styles.mapButtonText}>Zoom</Text>
          </TouchableOpacity>
          {/* Agrandi/Rétréci la carte */}
          <TouchableOpacity
            style={this.extend_button_style(this.state.color)}
            onPress={() => {
              if (this.state.height == '75%') {
                this.setState({
                  height: '30%',
                  width: '70%',
                  color: '#009688',
                  buttonTitle: 'Extend',
                });
              } else {
                this.setState({
                  height: '75%',
                  width: '100%',
                  color: '#c61a09',
                  buttonTitle: 'Reduce',
                });
              }
            }}>
            <Text style={Styles.mapButtonText}>{this.state.buttonTitle}</Text>
          </TouchableOpacity>
          {/* Rafraichi la position sur la carte */}
          <TouchableOpacity
            style={this.extend_button_style('#009688')}
            onPress={() => {
              this.getPos();
            }}>
            <Text style={Styles.mapButtonText}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Ligne numéro 2 des boutons (settings+history) */}
        <View style={Styles.mapButtonContainer}>
          {/* Passe à la page de settings en en envoyant le token de l'utilisateur et l'ID du traqueur */}
          <TouchableOpacity
            style={this.extend_button_style('#0F056B')}
            onPress={() => {
              this.props.navigation.navigate('SettingsNavigator', {
                trackerId: this.props.trackerId,
                token: this.props.token,
              });
            }}>
            <Text style={Styles.mapButtonText}>Settings</Text>
          </TouchableOpacity>
          {/* Passe à la page d'historique de position en envoyant l'ID du traqueur */}
          <TouchableOpacity
            style={this.extend_button_style('#0F056B')}
            onPress={() => {
              this.props.navigation.navigate('HistoryNavigator', {
                trackerId: this.props.trackerId,
              });
            }}>
            <Text style={Styles.mapButtonText}>History</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
