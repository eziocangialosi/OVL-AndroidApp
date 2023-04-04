import React, { Component } from 'react';
import { FlatList, View, TouchableOpacity, Text } from 'react-native';

import Styles from './styles';
import TrackerStyles from './trackerStyles';

const ButtonCreator = ({
  trackerName,
  trackerId,
  navigation,
  token,
}: ItemProps) => (
  <View style={Styles.item}>
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

interface AppProps {
  navigation: any;
  token: string;
}

interface AppState {
  data: any[];
}

export default class TrackerScreen extends Component<AppProps, AppState> {
  state: AppState = {
    data: [],
  };

  async getTrackers() {
    try {
      const response = await fetch(
        'https://ovl.tech-user.fr:6969/iot_list/' + this.props.token
      );
      const json = await response.json();
      console.log(json);
      this.setState({ data: json.trackers.iotArray });
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    console.log(this.props.token);
    this.getTrackers();
  }

  render() {
    const { data } = this.state;

    return (
      <View style={Styles.container}>
        <TouchableOpacity
          style={TrackerStyles.addTrackerButtonContainer}
          onPress={() =>
            this.props.navigation.navigate('AddTrackerNavigator', {
              token: this.props.token,
            })
          }>
          <Text style={TrackerStyles.appButtonText}>Add tracker</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={TrackerStyles.addTrackerButtonContainer}
          onPress={() => this.getTrackers()}>
          <Text style={TrackerStyles.appButtonText}>Refresh</Text>
        </TouchableOpacity>
        <Text style={TrackerStyles.listText}>Liste des trackers :</Text>
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
