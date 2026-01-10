import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function ProfileScreen({ navigation, route }) {
  // Get user data if passed, otherwise default
  const { user } = route.params || { user: { name: 'User', email: 'user@example.com' } };

  const handleLogout = () => {
    Alert.alert(
      "Log Out",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Log Out", 
          style: "destructive", 
          onPress: () => {
            // Reset navigation stack to prevent going back
            navigation.reset({
              index: 0,
              routes: [{ name: 'Auth' }],
            });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={40} color="#555" />
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Settings</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#333" />
          <Text style={styles.menuText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={24} color="#ccc" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcfcfc', padding: 20 },
  header: { marginBottom: 30, alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold' },
  
  profileCard: { alignItems: 'center', marginBottom: 40 },
  avatarContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e0e0e0', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  name: { fontSize: 24, fontWeight: 'bold', color: '#333' },
  email: { fontSize: 14, color: '#666', marginTop: 5 },

  menu: { marginBottom: 40 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333' },

  logoutBtn: { flexDirection: 'row', backgroundColor: '#FF6B6B', padding: 15, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});