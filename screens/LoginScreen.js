import React, { useContext, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Modal,
} from 'react-native';
import Toast from 'react-native-toast-message';
import client from '../api/client';
import { AuthContext } from '../context/AuthContext';
import styles from '../styles/LoginScreenStyles';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);
  const [webError, setWebError] = useState('');
  const [showWebModal, setShowWebModal] = useState(false);
  const { login } = useContext(AuthContext);

  const showSuccess = (message) => {
    if (Platform.OS === 'web') {
      setWebError('');
    } else {
      Toast.show({
        type: 'success',
        text1: '✅ Login Successful',
        text2: message,
      });
    }
  };

  const showError = (message) => {
    if (Platform.OS === 'web') {
      setWebError(message);
      setShowWebModal(true);
    } else {
      Toast.show({
        type: 'error',
        text1: '❌ Login Failed',
        text2: message,
      });
    }
  };

  const handleLogin = async () => {
    if (!email.trim()) {
      showError('Email is required');
      return;
    }
    if (!password.trim()) {
      showError('Password is required');
      return;
    }

    try {
      const response = await client.post('/login', { email, password });
      const token = response.data.token;
      await login(token);
      showSuccess('Welcome back!');
    } catch (error) {
      const message = error.response?.data?.error || 'Invalid credentials';
      showError(message);
    }
  };

  const FormContent = (
    <View style={styles.container}>
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Welcome Back</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          {...(Platform.OS === 'web' ? { tabIndex: 0 } : {})}
        />

        <View style={{ position: 'relative' }}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secureText}
            autoCapitalize="none"
            {...(Platform.OS === 'web' ? { tabIndex: 0 } : {})}
          />
          <TouchableOpacity
            onPress={() => setSecureText(!secureText)}
            style={{ position: 'absolute', right: 10, top: 18 }}
          >
            <Text style={{ color: '#007bff', fontWeight: 'bold' }}>
              {secureText ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>Don't have an account? Register here</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          {Platform.OS === 'web' ? (
            FormContent
          ) : (
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={{ flex: 1 }}>{FormContent}</View>
            </TouchableWithoutFeedback>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Web modal for login error */}
      {Platform.OS === 'web' && (
        <Modal visible={showWebModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>❌ Login Failed</Text>
              <Text style={styles.modalMessage}>{webError}</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity onPress={() => setShowWebModal(false)}>
                  <Text style={styles.modalClose}>OK</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}