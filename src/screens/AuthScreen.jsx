import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Platform } from 'react-native';
import axios from 'axios';

// Determine the correct host for Android emulator vs device/simulator
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://192.168.1.69:3000' : 'http://127.0.0.1:3000';
// If you have a specific LAN IP, replace the string below; otherwise DEFAULT_HOST will work
const API_URL = DEFAULT_HOST;

export default function AuthScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // New loading state

  const handleSubmit = async () => {
    if (!email || !password || (!isLogin && !name)) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setIsLoading(true); // Start loading spinner
    const endpoint = isLogin ? '/login' : '/signup';

    try {
      const payload = isLogin ? { email, password } : { name, email, password };
      console.log(`Sending request to: ${API_URL}${endpoint}`, payload);

      const res = await axios.post(`${API_URL}${endpoint}`, payload, { timeout: 8000 });

      if (res.data && res.data.status === 'ok') {
        navigation.replace('Dashboard', { user: res.data.user });
      } else {
        const message = (res.data && res.data.error) ? res.data.error : 'Authentication failed';
        Alert.alert('Failed', message);
      }
    } catch (error) {
      console.error('Auth Error:', error?.response?.data || error.message || error);
      if (error.response && error.response.data && error.response.data.error) {
        Alert.alert('Error', error.response.data.error);
      } else if (error.code === 'ECONNABORTED') {
        Alert.alert('Timeout', 'Server did not respond. Is it running?');
      } else {
        Alert.alert('Connection Error', 'Could not connect to server.\n• Check the API_URL in AuthScreen.\n• Ensure backend is running and reachable from the device/emulator.');
      }
    } finally {
      setIsLoading(false); // Stop loading spinner
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
      
      {!isLogin && (
        <TextInput 
          style={styles.input} 
          placeholder="Name" 
          value={name} 
          onChangeText={setName} 
        />
      )}
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        autoCapitalize="none" 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />

      <TouchableOpacity 
        style={[styles.btn, isLoading && { backgroundColor: '#FFD54F' }]} 
        onPress={handleSubmit}
        disabled={isLoading} // Disable button while loading
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#000" />
        ) : (
          <Text style={styles.btnText}>{isLogin ? 'Log In' : 'Sign Up'}</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin ? "New here? Sign Up" : "Have an account? Log In"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 25, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, color: '#333' },
  input: { backgroundColor: '#f0f0f0', borderRadius: 10, padding: 15, marginBottom: 15 },
  btn: { backgroundColor: '#FFC107', padding: 15, borderRadius: 10, alignItems: 'center', height: 50, justifyContent: 'center' },
  btnText: { fontWeight: 'bold', fontSize: 16, color: '#000' },
  switchText: { marginTop: 20, textAlign: 'center', color: '#666' }
});