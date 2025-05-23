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
import { StyleSheet } from 'react-native';


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
       text1: 'Login Successful',
       text2: 'Καλώς ήρθες στην εφαρμογή!',
       position: 'top', 
       visibilityTime: 3000, 
       autoHide: true,
       topOffset: 60, 
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
          placeholderTextColor="#aaa"
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
            placeholderTextColor="#aaa"
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
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formWrapper: {
    width: '100%',
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  passwordContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  togglePassword: {
    position: 'absolute',
    right: 12,
    top: 18,
    color: '#007bff',
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  linkText: {
    textAlign: 'center',
    color: '#007bff',
    textDecorationLine: 'underline',
  },
  
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalClose: {
    color: '#007bff',
    fontSize: 16,
  },
});