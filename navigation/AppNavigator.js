import { createStackNavigator } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ReservationFormScreen from '../screens/ReservationFormScreen';
import RestaurantListScreen from '../screens/RestaurantListScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated, loading, login } = useContext(AuthContext);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login">
            {(props) => (
              <LoginScreen {...props} route={{ ...props.route, params: { login } }} />
            )}
          </Stack.Screen>
          <Stack.Screen name="Register">
            {(props) => (
              <RegisterScreen {...props} route={{ ...props.route, params: { login } }} />
            )}
          </Stack.Screen>
        </>
      ) : (
        <>
          <Stack.Screen name="Restaurants" component={RestaurantListScreen} />
          <Stack.Screen name="Reservation" component={ReservationFormScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
