import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

/* Importation des classes/fonctions des autres fichiers */
import LoginScreen from './components/loginScreen';
import TrackerScreen from './components/trackerScreen';
import AddTrackerScreen from './components/addTrackerScreen';
import CoordinatesScreen from './components/coordinatesScreen';
import HistoryScreen from './components/historyScreen';
import SettingsScreen from './components/settingsScreen';

/* Fonction principale : elle se lance lorsque l'application démarre. */
const Main = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      {/* Créé l'interface en mettant comme interface initiale celle de connexion */}
      <Stack.Navigator initialRouteName="ConnexionNavigator">
        {/* Définition de l'interface de navigation pour la connexion en liant la fonction
        qui s'occupera de cette affichage. */}
        <Stack.Screen name="LoginNavigator" component={LoginScreen} />
        {/* Définition de l'interface de navigation pour la selection des trackers en liant la fonction
        qui s'occupera de cette affichage. */}
        <Stack.Screen
          name="TrackerNavigator"
          component={({ route }) => (
            <TrackerScreen
              token={route.params.token}
              navigation={route.params.navigation}
            />
          )}
        />
        {/* Définition de l'interface de navigation pour la connexion en liant la fonction
        qui s'occupera de cette affichage. */}
        <Stack.Screen name="AddTrackerNavigator" component={AddTrackerScreen} />
        <Stack.Screen
          name="CoordinatesNavigator"
          component={({ route }) => (
            <CoordinatesScreen
              trackerId={route.params.trackerId}
              navigation={route.params.navigation}
              token={route.params.token}
            />
          )}
        />
        <Stack.Screen
          name="HistoryNavigator"
          component={({ route }) => (
            <HistoryScreen trackerId={route.params.trackerId} />
          )}
        />
        <Stack.Screen
          name="SettingsNavigator"
          component={({ route }) => (
            <SettingsScreen trackerId={route.params.trackerId} token={route.params.token} />
          )}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Main;
