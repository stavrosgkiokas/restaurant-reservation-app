import React, { useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { HeaderBackButton } from '@react-navigation/elements';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';

export default function ReservationConfirmationScreen({ route }) {
  const { restaurant, datetime, peopleCount } = route.params;
  const { token } = useContext(AuthContext);
  const navigation = useNavigation();

  useEffect(() => {
    const saveReservation = async () => {
      try {
        const localDate = new Date(datetime);
        const date = localDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const time = localDate.toTimeString().split(' ')[0]; // HH:MM:SS

        await client.post('/reservations', {
          restaurant_id: restaurant.restaurant_id,
          date,
          time,
          people_count: peopleCount,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        console.error('Reservation save failed:', error);
        Alert.alert('Σφάλμα', 'Η αποθήκευση της κράτησης απέτυχε.');
      }
    };

    saveReservation();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      navigation.setOptions({
        headerBackTitleVisible: false,
        headerLeft: () => (
          <HeaderBackButton
            onPress={() =>
              navigation.reset({ index: 0, routes: [{ name: 'Restaurants' }] })
            }
          />
        ),
      });
    }, [navigation])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Επιβεβαίωση Κράτησης</Text>
      <Text style={styles.label}>Εστιατόριο:</Text>
      <Text style={styles.value}>{restaurant.name}</Text>

      <Text style={styles.label}>Ημερομηνία & Ώρα:</Text>
      <Text style={styles.value}>{new Date(datetime).toLocaleString('el-GR')}</Text>

      <Text style={styles.label}>Αριθμός Ατόμων:</Text>
      <Text style={styles.value}>{peopleCount}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 25,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15,
  },
  value: {
    fontSize: 16,
    marginTop: 5,
  },
});
