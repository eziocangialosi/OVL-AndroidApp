import React, { Component, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

/* Importation des styles pour les éléments de l'interface */
import Styles from './styles';

/* Arguments de la class 'TrackerScreen' */
interface AppProps {
  navigation: any;
  trackerId: string;
  token: string;
}

/* Argument 'data' de la class 'TrackerScreen' */
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

  extend_button_style = function (a_color) {
    return {
      backgroundColor: a_color,
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginHorizontal: 125,
      margin: 15,
      width: 65,
      alignSelf: 'center',
    };
  };

  async getPos() {
    try {
      /* Faire une requête à l'API en lui donnant le token l'utilisateur */
      const response = await fetch(
        'https://ovl.tech-user.fr:6969/position/now/' + this.props.trackerId
      );
      /* Attend la réponse de l'API et la met en json dans la variable 'json' */
      const json = await response.json();
      console.log(json);
      /* Met dans la variable 'data' le liste des noms et des id des trackers */
      var t = new Date(Number(json.now.timestamp) * 1000);
      var formatted =
        ('0' + t.getDate()).slice(-2) +
        '/' +
        ('0' + (t.getMonth() + 1)).slice(-2) +
        '/' +
        t.getFullYear() +
        ' ' +
        ('0' + t.getHours()).slice(-2) +
        ':' +
        ('0' + t.getMinutes()).slice(-2) +
        ':' +
        ('0' + t.getSeconds()).slice(-2);
      console.log(formatted);
      console.log(Number(json.now.lat));
      console.log(Number(json.now.lon));
      this.setState({
        data: json.now,
        date: formatted,
        latitude: json.now.lat,
        longitude: json.now.lon,
      });
    } catch (error) {
      console.log(error);
    }
  }

  /* Appelle la fonction 'getTrackers' lorsque l'objet de la classe est créé */
  componentDidMount() {
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

        <View style={Styles.container2}>
          <View style={Styles.text}>
            <TouchableOpacity
              style={this.extend_button_style('#009688')}
              onPress={() => {
                this.props.navigation.navigate('SettingsNavigator', {
                  trackerId: this.props.trackerId,
                  token: this.props.token,
                });
              }}>
              <Text style={Styles.mapButtonText}>Settings</Text>
            </TouchableOpacity>
          </View>

          <View style={Styles.text}>
            <TouchableOpacity style={this.extend_button_style('#009688')}>
              <Text style={Styles.mapButtonText}>Zoom</Text>
            </TouchableOpacity>
          </View>

          <View style={Styles.text}>
            <TouchableOpacity
              style={this.extend_button_style(this.state.color)}
              onPress={() => {
                if (this.state.height == '80%') {
                  this.setState({
                    height: '30%',
                    width: '70%',
                    color: '#009688',
                    buttonTitle: 'Extend',
                  });
                } else {
                  this.setState({
                    height: '80%',
                    width: '100%',
                    color: '#c61a09',
                    buttonTitle: 'Reduce',
                  });
                }
              }}>
              <Text style={Styles.mapButtonText}>{this.state.buttonTitle}</Text>
            </TouchableOpacity>
          </View>

          <View style={Styles.text}>
            <TouchableOpacity
              style={this.extend_button_style('#009688')}
              onPress={() => {
                this.getPos();
              }}>
              <Text style={Styles.mapButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>

          <View style={Styles.text}>
            <TouchableOpacity
              style={this.extend_button_style('#009688')}
              onPress={() => {
                this.props.navigation.navigate('HistoryNavigator', {
                  trackerId: this.props.trackerId,
                });
              }}>
              <Text style={Styles.mapButtonText}>History</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
