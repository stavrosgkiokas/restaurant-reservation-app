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

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secureText, setSecureText] = useState(true);

  const [webMessage, setWebMessage] = useState('');
  const [webTitle, setWebTitle] = useState('');
  const [showWebModal, setShowWebModal] = useState(false);

  const { login } = useContext(AuthContext);

  const showToast = (type, title, message) => {
    if (Platform.OS === 'web') {
      setWebTitle(title);
      setWebMessage(message);
      setShowWebModal(true);
    } else {
      Toast.show({ type, text1: title, text2: message });
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return showToast('error', '❌ Registration Failed', 'All fields are required.');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return showToast('error', '❌ Registration Failed', 'Please enter a valid email address.');
    }

    if (password.length < 6 || !/\d/.test(password)) {
      return showToast('error', '❌ Registration Failed', 'Password must be at least 6 characters and contain a number.');
    }

    try {
      const response = await client.post('/register', { name, email, password });
      showToast('success', '✅ Registration Successful', response.data.message || 'You are now registered!');
    } catch (error) {
      const message = error.response?.data?.error || 'Something went wrong';
      showToast('error', '❌ Registration Failed', message);
    }
  };

  const FormContent = (
    <View style={styles.container}>
      <View style={styles.formWrapper}>
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#aaa"
          {...(Platform.OS === 'web' ? { tabIndex: 0 } : {})}
        />

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

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
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

      {Platform.OS === 'web' && (
        <Modal visible={showWebModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{webTitle}</Text>
              <Text style={styles.modalMessage}>{webMessage}</Text>
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
    marginBottom: 30,
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
  button: {
    backgroundColor: '#28a745',
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

  // Web modal styles
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