import * as React from 'react';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

/* Créé les styles pour les éléments de l'interface */
export default HistoryStyles = StyleSheet.create({
  app: {
    flex: 4, // the number of columns you want to devide the screen into
    marginHorizontal: 'auto',
    width: 400,
    backgroundColor: 'red',
  },
  row: {
    flexDirection: 'row',
  },
  col: {
    backgroundColor: 'lightblue',
    borderColor: '#fff',
    borderWidth: 1,
    flex: 1,
  },
  historyContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#e4eded',
    padding: 8,
  },
  historyParagraph: {
    margin: 3,
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'left',
  },
});
