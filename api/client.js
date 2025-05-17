// client.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Platform } from 'react-native';

const client = axios.create({
  baseURL: 'http://192.168.2.3:3000',
});

client.interceptors.request.use(async (config) => {
  let token;
  if (Platform.OS === 'web') {
    token = localStorage.getItem('token');
  } else {
    token = await AsyncStorage.getItem('token');
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default client;
