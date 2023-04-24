import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

/* Créé les styles pour la page 'historyScreen' */
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
    width: 325,
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
