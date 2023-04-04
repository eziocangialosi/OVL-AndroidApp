import React, { Component } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { ProgressBar } from 'react-native-paper';

/* Importation des styles */
import Styles from './styles';

/* Attributs de la class 'SettingsScreen' */
interface AppState {
  data: any[];
  statusCharge: Boolean;
  statusBat: String;
  statusAlarm: Boolean;
  statusOnline: Boolean;
  statusEcomode: Boolean;
  statusProtection: Boolean;
  statusVhCharge: Boolean;
  statusGPS: Boolean;
  alarmChanged: String;
  ecoChanged: String;
  protectionChanged: String;
  batteryChargeColor: String;
}

/* Paramètres de la class 'SettingsScreen' */
interface AppProps {
  trackerId: String;
  token: String;
}

/* Affiche la page affichant les statuts du traqueur et les paramètres changeables
Reçoit l'ID d'un traqueur et la variable navigation */
export default class SettingsScreen extends Component<AppState, AppProps> {
  state: AppState = {
    data: [],
    statusCharge: 0,
    statusBat: '0',
    statusAlarm: 0,
    statusOnline: 0,
    statusEcomode: 0,
    statusProtection: 0,
    statusVhCharge: 0,
    statusGPS: 0,
    alarmChanged: '',
    ecoChanged: '',
    protectionChanged: '',
    batteryChargeColor: '#c61a09',
  };

  /* Style pour les statuts et paramètres du traqueur (rouge pour désactivé, vert pour activé) 
  Reçoit en paramètre un booléen indiquant si le statut/paramètre est activé ou non */
  status_style = function (state) {
    var a_color = '#c61a09';
    /* Si le statut/paramètre est activé, met le bouton en vert */
    if (state == 1) {
      a_color = '#22844e';
    }
    return {
      marginTop: 16,
      paddingVertical: 8,
      borderRadius: 6,
      backgroundColor: a_color,
      textAlign: 'center',
      fontSize: 20,
      fontWeight: 'bold',
      alignSelf: 'center',
      width: 150,
    };
  };

  /* Change le statut (activé/désactivé) du paramètre 'EcoMode'  (ne l'applique pas) */
  changeEcoSettings = () => {
    /* Si le paramètre n'a pas été changé, met une étoile devant le paramètre 'EcoMode' indiquant le changement */
    if (this.state.ecoChanged == '') {
      /* Si le statut était désactivé, l'active*/
      if (this.state.statusEcomode == 0) {
        this.setState({
          ecoChanged: '*',
          statusEcomode: 1,
        });
        /* Sinon, le désactive */
      } else {
        this.setState({
          ecoChanged: '*',
          statusEcomode: 0,
        });
      }
      /* Si la paramètre a déjà été changé, enlève l'étoile */
    } else {
      if (this.state.statusEcomode == 0) {
        this.setState({
          ecoChanged: '',
          statusEcomode: 1,
        });
      } else {
        this.setState({
          ecoChanged: '',
          statusEcomode: 0,
        });
      }
    }
  };

  /* Change le statut (activé/désactivé) du paramètre 'Alarm' (ne l'applique pas) */
  changeAlarmSettings = () => {
    /* Si le paramètre n'a pas été changé, met une étoile devant le paramètre 'Alarm' indiquant le changement */
    if (this.state.alarmChanged == '') {
      /* Si le statut était désactivé, l'active*/
      if (this.state.statusAlarm == 0) {
        this.setState({
          alarmChanged: '*',
          statusAlarm: 1,
        });
        /* Sinon, le désactive */
      } else {
        this.setState({
          alarmChanged: '*',
          statusAlarm: 0,
        });
      }
      /* Si la paramètre a déjà été changé, enlève l'étoile */
    } else {
      if (this.state.statusAlarm == 0) {
        this.setState({
          alarmChanged: '',
          statusAlarm: 1,
        });
      } else {
        this.setState({
          alarmChanged: '',
          statusAlarm: 0,
        });
      }
    }
  };

  /* Change le statut (activé/désactivé) du paramètre 'Protection'  (ne l'applique pas) */
  changeProtectionSettings = () => {
    /* Si le paramètre n'a pas été changé, met une étoile devant le paramètre 'Protection' indiquant le changement */
    if (this.state.protectionChanged == '') {
      /* Si le statut était désactivé, l'active*/
      if (this.state.statusProtection == 0) {
        this.setState({
          protectionChanged: '*',
          statusProtection: 1,
        });
        /* Sinon, le désactive */
      } else {
        this.setState({
          protectionChanged: '*',
          statusProtection: 0,
        });
      }
      /* Si la paramètre a déjà été changé, enlève l'étoile */
    } else {
      if (this.state.statusProtection == 0) {
        this.setState({
          protectionChanged: '',
          statusProtection: 1,
        });
      } else {
        this.setState({
          protectionChanged: '',
          statusProtection: 0,
        });
      }
    }
  };

  /* Applique les settings changés
  Reçoit en paramètre l'ID d'un traqueur ainsi que le statut de l'alarm, du mode économique, de la protection et de la charge du véhicule */
  putSettings = (trackerId, alarm, ecoMode, protection, vhCharge) => {
    /* Réinitialise les statuts de changement */
    this.setState({
      alarmChanged: '',
      ecoChanged: '',
      protectionChanged: '',
    });
    /* Fait une requête à l'API pour changer les paramètres du traqueur */
    fetch('https://ovl.tech-user.fr:6969/set/status/', {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      /* Envoie l'ID du traqueur et le statut de chaque paramètre */
      body: JSON.stringify({
        id_iot: trackerId,
        status_alarm: alarm,
        status_ecomode: ecoMode,
        status_protection: protection,
        status_vh_charge: vhCharge,
      }),
    })
      /* Récupère la réponse de l'API */
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        /* Si le changement s'est bien effectué, affiche que ça s'est bien effectué */
        if (json.error.Message == 'Nothing goes wrong.') {
          alert('Changement appliqués !');
        } else {
          alert("Erreur lors de l'application des changements.");
        }
      })
      .catch((error) => {
        /* Si l'API ne répond pas, affiche une erreur indiquant que l'API ne fonctionne pas */
        console.log(error);
        alert('API down');
      });
  };

  /* Fonction qui va faire une requête à l'API en envoyant le token de l'utilisateur afin de recevoir les statuts de son traqueur */
  async getStatus() {
    try {
      /* Réinitialise les statuts/paramètres du traqueur dans la class */
      this.setState({
        data: [],
        statusCharge: 0,
        statusBat: '0',
        statusAlarm: 0,
        statusOnline: 0,
        statusEcomode: 0,
        statusProtection: 0,
        statusVhCharge: 0,
        statusGPS: 0,
        alarmChanged: '',
        ecoChanged: '',
        protectionChanged: '',
      });
      /* Fait le requête à l'API en envoyant le token de l'utilisateur */
      const response = await fetch(
        'https://ovl.tech-user.fr:6969/status_list/' + this.props.token
      );
      /* Récupère la réponse dans la variable 'json' */
      const json = await response.json();
      /* Met dans 'data' le json */
      this.setState({
        data: json.status_list[this.props.trackerId - 1],
      });
      console.log(json.status_list[this.props.trackerId - 1]);

      this.setState({
        statusBat: json.status_list[this.props.trackerId - 1].status_bat,
      });

      /* Si la charge de la batterie est supérieur à 60%, change la couleur de la barre de charge en vert */
      if (Number(json.status_list[this.props.trackerId - 1].status_bat) > 60) {
        this.setState({
          batteryChargeColor: '#096A09',
        });
        /* Si la charge de la batterie est inférieur à 30%, change la couleur de la barre de charge en rouge */
      } else if (
        Number(json.status_list[this.props.trackerId - 1].status_bat) < 30
      ) {
        this.setState({
          batteryChargeColor: '#c61a09',
        });
        /* Sinon, la met en orange */
      } else {
        this.setState({
          batteryChargeColor: '#ff7f00',
        });
      }
      statusBat = json.status_list[this.props.trackerId - 1].status_bat;

      /* Pour chaque 'if(...)', initialise les statuts du traqueur dans la classe pour mettre ceux reçu par l'API */
      if (json.status_list[this.props.trackerId - 1].status_charge == 1) {
        this.setState({
          statusCharge: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_alarm == 1) {
        this.setState({
          statusAlarm: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_ecomode == 1) {
        this.setState({
          statusEcomode: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_online == 1) {
        this.setState({
          statusOnline: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_protection == 1) {
        this.setState({
          statusProtection: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_gps == 1) {
        this.setState({
          statusGPS: 1,
        });
      }
      if (json.status_list[this.props.trackerId - 1].status_vh_charge == 1) {
        this.setState({
          status_vh_charge: 1,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  /* Lance la fonction 'getStatus' à la création de la class */
  componentDidMount() {
    console.log('');
    console.log('SETTINGS SCREEN LOGS :');
    this.getStatus();
  }

  /* Affiche des logs à la destruction de la class */
  componentDidUnMount() {
    console.log('');
    console.log('COORDINATES SCREEN LOGS :');
  }

  render() {
    return (
      <View style={Styles.container}>
        {/* Réappelle la fonction 'getStatus' pour rafraichir les statuts */}
        <TouchableOpacity
          style={Styles.settingsButtonContainer}
          onPress={() => {
            this.getStatus();
          }}>
          <Text style={Styles.buttonText}>{'Refresh'}</Text>
        </TouchableOpacity>
        {/* Applique les paramètres changés */}
        <TouchableOpacity
          style={Styles.settingsButtonContainer}
          onPress={() => {
            this.putSettings(
              this.props.trackerId,
              this.state.statusAlarm,
              this.state.statusEcomode,
              this.state.statusProtection,
              this.state.statusVhCharge
            );
          }}>
          <Text style={Styles.buttonText}>{'Apply Settings'}</Text>
        </TouchableOpacity>

        <Text style={Styles.listText}>
          {'Battery charge (' + this.state.statusBat + '%) :'}
        </Text>
        <ProgressBar
          progress={Number(this.state.statusBat) / 100}
          color={this.state.batteryChargeColor}
          style={Styles.batteryBar}
        />

        {/* Affiche les statuts du traqueur */}
        <Text style={Styles.listText}>{'Tracker status :'}</Text>
        <Text style={this.status_style(this.state.data.status_vh_charge)}>
          {'In charge'}
        </Text>

        <Text style={this.status_style(this.state.data.status_online)}>
          {'Is connected'}
        </Text>

        <Text style={this.status_style(this.state.data.status_vh_charge)}>
          {'Vehicule charge'}
        </Text>

        <Text style={this.status_style(this.state.data.status_gps)}>
          {'GPS'}
        </Text>

        {/* Affiche le statut des paramètres du traqueur */}
        <Text style={Styles.listText}>{'Tracker settings :'}</Text>
        {/* Pour chaque paramètre, change dans la class le statut du paramètre lorsque le boutton est appuyé */}
        <TouchableOpacity
          style={this.status_style(this.state.statusAlarm)}
          onPress={() => {
            this.changeAlarmSettings();
          }}>
          <Text style={Styles.buttonText}>
            {this.state.alarmChanged + ' Alarm'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={this.status_style(this.state.statusEcomode)}
          onPress={() => {
            this.changeEcoSettings();
          }}>
          <Text style={Styles.buttonText}>
            {this.state.ecoChanged + ' Eco mode'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={this.status_style(this.state.statusProtection)}
          onPress={() => {
            this.changeProtectionSettings();
          }}>
          <Text style={Styles.buttonText}>
            {this.state.protectionChanged + ' Protection'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
