import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import client from '../api/client';
import { useNavigation } from '@react-navigation/native';



import burgerKing from '../assets/images/burger-king.jpg';
import greekTavern from '../assets/images/greektavern.jpg';
import pizza from '../assets/images/pizza.jpg';
import sushi from '../assets/images/sushi.jpg';
import vegan from '../assets/images/vegan.jpg';

export default function RestaurantListScreen() {
  const { token, loading: authLoading } = useContext(AuthContext);
  const [restaurants, setRestaurants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await client.get('/restaurants', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRestaurants(response.data);
      } catch (error) {
        console.error('❌ FETCH ERROR:', error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && token) {
      fetchRestaurants();
    }
  }, [authLoading, token]);

  const imageMap = {
    'La Pizzeria': pizza,
    'Sushi World': sushi,
    'Greek Tavern': greekTavern,
    'Vegan Delight': vegan,
    'Burger King': burgerKing,
  };

  const filteredRestaurants = restaurants.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || authLoading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text>Loading restaurants...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={Platform.OS === 'web' ? styles.webScrollView : null}
      contentContainerStyle={styles.container}
    >
      <TextInput
        style={styles.searchInput}
        placeholder="Αναζήτηση με όνομα ή τοποθεσία"
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#aaa"
      />
      <View style={Platform.OS === 'web' ? styles.grid : null}>
        {filteredRestaurants.length === 0 ? (
          <Text style={styles.emptyText}>Δεν βρέθηκαν εστιατόρια.</Text>
        ) : (
          filteredRestaurants.map((item) => {
            const image = imageMap[item.name];
            return (
              <TouchableOpacity
                key={item.restaurant_id}
                style={[styles.card, Platform.OS === 'web' && styles.cardWeb]}
                onPress={() => navigation.navigate('Reservation', { restaurant: item })}
              >
                {image && <Image source={image} style={styles.image} />}
                <View style={styles.textWrapper}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.location}>{item.location}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  webScrollView: {
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'web' ? 76 : 60,
    paddingBottom: 40,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  grid: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  gap: 15, 
},
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
  card: {
    backgroundColor: '#fff',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardWeb: {
  width: '48%', 
  marginBottom: 20,
  borderRadius: 10,
  overflow: 'hidden',
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
},

image: {
  width: '100%',
  height: 180,
  objectFit: 'cover', 
},
  textWrapper: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  location: {
    fontStyle: 'italic',
    color: '#666',
    marginBottom: 5,
  },
  description: {
    color: '#333',
  },
});
