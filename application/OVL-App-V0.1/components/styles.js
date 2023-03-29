import * as React from 'react';
import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

/* Créé les styles pour les éléments de l'interface */
export default Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#e4eded',
    padding: 8,
  },
  paragraph: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    backgroundColor: '#c8cfcf',
    padding: 10,
    borderRadius: 10,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  coordinates: {
    fontSize: 18,
    textAlign: 'center',
  },
  buttonContainer: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 125,
    margin: 10,
    width: 150,
    alignSelf: 'center',
    flex: 1,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  mapButtonText: {
    fontSize: 13,
    color: '#fff',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: 20,
    flexDirection: 'row',
    width: '100%',
    backgroundColor: 'white',
    borderColor: '#000',
    borderWidth: 2,
    borderRadius: 5,
  },
  text: {
    flex: 1,
  },
  text2: {
    flex: 2,
  },
});
