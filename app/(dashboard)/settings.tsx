// app/settings.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // ✅ Import useRouter for navigation
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ImageBackground,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const Settings = () => {
  const router = useRouter(); // ✅ Initialize router for navigation

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);
  const toggleDarkMode = () => setDarkModeEnabled((prev) => !prev);

  const handleClearAll = () => {
    Alert.alert(
      'Confirm Clear',
      'Are you sure you want to delete all movies?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Delete All',
          style: 'destructive',
          onPress: () => {
            // TODO: Implement deleteAllMovies()
            Alert.alert('Deleted', 'All movies have been deleted.');
          },
        },
      ]
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes, Logout',
          style: 'destructive',
          onPress: () => {
            // TODO: Add actual logout logic (e.g., clear token, reset auth state)

            // Navigate to login screen
            router.replace('/login'); // ✅ Navigates to login.tsx and prevents going back
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />

      {/* Hero Header */}
      <View style={styles.heroContainer}>
        <ImageBackground
          source={require('../../assets/images/screen-0.jpg')}
          style={styles.heroBg}
          resizeMode="cover"
        >
          <View style={styles.overlay} />
          <View style={styles.heroContent}>
            <View style={styles.logoCircle}>
              <Ionicons name="settings-outline" size={36} color="#fff" />
            </View>

            <View style={styles.logoRow}>
              <Text style={styles.movieText}>Movie</Text>
              <View style={styles.hubBox}>
                <Text style={styles.hubText}>Hub</Text>
              </View>
            </View>

            <Text style={styles.tagline}>⚙️ Settings</Text>
            <Text style={styles.subtitle}>Customize your experience</Text>
          </View>
        </ImageBackground>
      </View>

      {/* Settings List */}
      <View style={styles.settingsList}>
        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ true: '#f59e0b', false: '#666' }}
            thumbColor={notificationsEnabled ? '#fff' : '#aaa'}
          />
        </View>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>Dark Mode</Text>
          <Switch
            value={darkModeEnabled}
            onValueChange={toggleDarkMode}
            trackColor={{ true: '#f59e0b', false: '#666' }}
            thumbColor={darkModeEnabled ? '#fff' : '#aaa'}
          />
        </View>

        <TouchableOpacity style={styles.settingItem} onPress={handleClearAll}>
          <Text style={[styles.settingText, { color: '#EF4444' }]}>
            🗑️ Clear All Movies
          </Text>
        </TouchableOpacity>

        <View style={styles.settingItem}>
          <Text style={styles.settingText}>📘 About</Text>
          <Text style={styles.aboutText}>
            MovieHub v1.0. Manage and review your favorite movies.
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111' },

  // Hero Header
  heroContainer: {
    height: screenHeight * 0.32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
    marginBottom: 16,
  },
  heroBg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 2,
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  movieText: {
    fontSize: 32,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: -0.5,
  },
  hubBox: {
    backgroundColor: '#f59e0b',
    marginLeft: 8,
    borderRadius: 6,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hubText: {
    fontSize: 30,
    fontWeight: '900',
    color: '#000',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f9fafb',
    marginTop: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#ccc',
    textAlign: 'center',
    marginTop: 4,
  },

  // Settings list
  settingsList: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  settingItem: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  aboutText: {
    color: '#ccc',
    fontSize: 13,
    marginTop: 4,
    flex: 1,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default Settings;
