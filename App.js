import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';

const NASA_API_KEY = 'i84dyMppzTutNWahSN6iRYBWZkQEdK58a8NaMbqa';  // Your actual NASA API key

export default function App() {
  const [asteroidId, setAsteroidId] = useState('');
  const [asteroidData, setAsteroidData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAsteroidData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/neo/${asteroidId}?api_key=${NASA_API_KEY}`
      );
      setAsteroidData(response.data);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError('Failed to fetch asteroid data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const browseAsteroids = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.nasa.gov/neo/rest/v1/neo/browse?api_key=${NASA_API_KEY}`
      );
      const randomAsteroid = response.data.near_earth_objects[0]; // Selecting the first one for now
      setAsteroidId(randomAsteroid.id);
      fetchAsteroidData(); // Fetch its details
    } catch (err) {
      setError('Failed to browse asteroids.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Asteroid Data Form</Text>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Enter Asteroid ID</Text>
        <TextInput
          placeholder="e.g. 3542519"
          style={styles.input}
          value={asteroidId}
          onChangeText={setAsteroidId}
          placeholderTextColor="#999"
        />
      </View>

      <TouchableOpacity
        style={[styles.button, !asteroidId && styles.disabledButton]}
        onPress={fetchAsteroidData}
        disabled={!asteroidId || loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Submit'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.browseButton}
        onPress={browseAsteroids}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Browse Asteroids</Text>
      </TouchableOpacity>

      {error && <Text style={styles.error}>{error}</Text>}

      {asteroidData && (
        <View style={styles.asteroidInfo}>
          <Text style={styles.asteroidText}><Text style={styles.label}>Name:</Text> {asteroidData.name}</Text>
          <Text style={styles.asteroidText}><Text style={styles.label}>NASA JPL URL:</Text> {asteroidData.nasa_jpl_url}</Text>
          <Text style={styles.asteroidText}>
            <Text style={styles.label}>Hazardous:</Text> {asteroidData.is_potentially_hazardous_asteroid ? 'Yes' : 'No'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f7f9fc',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  button: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#9e9e9e',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  browseButton: {
    backgroundColor: '#03DAC6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginTop: 16,
    textAlign: 'center',
  },
  asteroidInfo: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e0f7fa',
    borderRadius: 8,
  },
  asteroidText: {
    fontSize: 16,
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
    color: '#333',
  },
});
