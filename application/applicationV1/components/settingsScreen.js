import React, { Component, useState } from 'react';
import { View, Text, Button } from 'react-native';

import Styles from './styles';

interface AppProps {
  trackerId: string;
  token: string;
}

interface AppState {
  data: any[];
}

export default class SettingsScreen extends Component<AppProps> {
  state: AppState = {
    data: [],
  };

  async getPos() {
    try {
      const response = await fetch(
        'https://ovl.tech-user.fr:6969/status_list/' + this.props.token
      );
      const json = await response.json();
      console.log(json);
      console.log(json.status_list[this.props.trackerId-1]);
      this.setState({
        data: json.status_list[this.props.trackerId-1]
      })
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount() {
    this.getPos();
  }

  test = function () {
    
  }


  render() {
    return (
      <View style={Styles.container}>
        <Text>{this.state.data.status_bat}</Text>
      </View>
    );
  }
}
