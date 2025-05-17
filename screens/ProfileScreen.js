import React, { useContext, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import { Button } from 'react-native-paper';
import { useIsFocused } from '@react-navigation/native';

export default function ProfileScreen() {
  const { token } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  const fetchReservations = async () => {
    if (!token) return;

    setLoading(true);
    try {
      const response = await client.get('/reservations/user', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReservations(response.data);
    } catch (error) {
      console.error('❌ Error fetching reservations:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchReservations();
    }
  }, [isFocused, token]);

  const deleteReservation = async (id) => {
    try {
      await client.delete(`/reservations/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchReservations();
    } catch (error) {
      console.error('❌ Delete failed:', error.response?.data || error.message);
    }
  };

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return 'Άγνωστη ημερομηνία';
    try {
      const [y, m, d] = dateStr.split('-');
      const [h, min] = timeStr.split(':');
      return `${d}/${m}/${y}, ${h}:${min}`;
    } catch {
      return 'Άγνωστη ημερομηνία';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Οι κρατήσεις μου</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : reservations.length === 0 ? (
        <Text style={styles.noReservations}>Δεν υπάρχουν κρατήσεις.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.reservation_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{formatDateTime(item.date, item.time)}</Text>
              <Text style={styles.itemText}>
                {item.people_count} άτομα στο {item.restaurant}
              </Text>
              <Button
                mode="outlined"
                compact
                onPress={() => deleteReservation(item.reservation_id)}
                labelStyle={{ fontSize: 12 }}
              >
                Διαγραφή
              </Button>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    marginTop: 20,
    flex: 1,
    alignItems: 'flex-start',
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noReservations: {
    color: '#888',
    marginTop: 30,
    fontSize: 14,
  },
  item: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderLeftWidth: 3,
    borderLeftColor: '#007bff',
    borderRadius: 4,
  },
  itemText: {
    fontSize: 13,
    marginBottom: 3,
  },
});
