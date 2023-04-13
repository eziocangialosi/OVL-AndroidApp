import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

/* Créé les styles généraux */
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
  settingsButtonContainer: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 10,
    marginHorizontal: 125,
    margin: 10,
    width: 250,
    alignSelf: 'center',
  },
  listText: {
    fontSize: 22,
    color: '#000000',
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    textDecorationLine: 'underline',
    marginTop: 15,
  },
  mapButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapButtonOpacity: {
    backgroundColor: '#009688',
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 7,
    margin: 5,
    width: 75,
    alignSelf: 'center',
  },
  mapButtonText: {
    fontSize: 16,
    textAlign: 'center',
  },
  batteryBar: {
    width: 300,
    height: 15,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
  },
});
