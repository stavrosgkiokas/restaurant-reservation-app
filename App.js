import React, { useContext, useEffect, useState, useMemo } from 'react';
import {
  ActivityIndicator,
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { registerTranslation } from 'react-native-paper-dates';

import { AuthContext, AuthProvider } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import RestaurantListScreen from './screens/RestaurantListScreen';
import ReservationFormScreen from './screens/ReservationFormScreen';
import ReservationConfirmationScreen from './screens/ReservationConfirmationScreen';
import ProfileScreen from './screens/ProfileScreen';

// ✅ Greek date picker translations
registerTranslation('el', {
  save: 'Αποθήκευση',
  selectSingle: 'Επιλογή ημερομηνίας',
  selectMultiple: 'Επιλογή ημερομηνιών',
  selectRange: 'Επιλογή διαστήματος',
  notAccordingToDateFormat: inputFormat => `Η μορφή πρέπει να είναι ${inputFormat}`,
  mustBeHigherThan: date => `Μετά από ${date}`,
  mustBeLowerThan: date => `Πριν από ${date}`,
  mustBeBetween: (start, end) => `Μεταξύ ${start} - ${end}`,
  dateIsDisabled: 'Η ημερομηνία δεν επιτρέπεται',
  previous: 'Προηγούμενος',
  next: 'Επόμενος',
  typeInDate: 'Εισάγετε ημερομηνία',
  pickDateFromCalendar: 'Επιλέξτε ημερομηνία από το ημερολόγιο',
  close: 'Κλείσιμο',
});

const Stack = createStackNavigator();

function RootNavigator() {
  const { isAuthenticated, loading, logout } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerTitleAlign: 'center',
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Restaurants"
            component={RestaurantListScreen}
            options={({ navigation }) => ({
              headerTitle: 'Εστιατόρια',
              headerRight: () => (
                <View style={styles.headerButtons}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Profile')}
                    style={styles.profileButton}
                  >
                    <Ionicons name="person-circle-outline" size={26} color="#333" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={logout}>
                    <Ionicons name="log-out-outline" size={24} color="#d00" />
                  </TouchableOpacity>
                </View>
              ),
            })}
          />
          <Stack.Screen
            name="Reservation"
            component={ReservationFormScreen}
            options={{ headerTitle: 'Κράτηση' }}
          />
          <Stack.Screen
            name="ReservationConfirmation"
            component={ReservationConfirmationScreen}
            options={{ headerTitle: 'Επιβεβαίωση Κράτησης' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ headerTitle: 'Το προφίλ μου' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await Font.loadAsync(Ionicons.font);
      setFontsLoaded(true);
    })();
  }, []);

  if (!fontsLoaded) return null;

  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
          <Toast />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  profileButton: {
    marginRight: 15,
  },
});
