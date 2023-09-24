import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Alert } from 'react-native'; // Removed Text import
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [searchLocation, onChangeLocation] = useState('');
  const [mapRegion, setMapRegion] = useState(null);

  const initial = {
    latitude: 60.200692,
    longitude: 24.934302,
    latitudeDelta: 0.0322,
    longitudeDelta: 0.0221
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('No permission to get location');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0322,
        longitudeDelta: 0.0221
      });
    })();
  }, []);

  const findLocation = () => {
    const apikey = process.env.EXPO_PUBLIC_API_KEY;
    const url = `https://www.mapquestapi.com/geocoding/v1/address?key=${apikey}&location=${searchLocation}`;

    fetch(url)
      .then(response => response.json())
      .then(result => {
        if (result.results && result.results[0].locations && result.results[0].locations[0]) {
          const latLng = result.results[0].locations[0].latLng;
          setMapRegion({
            ...mapRegion,
            latitude: latLng.lat,
            longitude: latLng.lng,
          });
        }
      })
      .catch(error => console.log('error', error));
  };

  return (
    <View style={styles.container}>
      {mapRegion && (
        <MapView
          style={{ flex: 1, width: "100%", height: "100%" }}
          initialRegion={initial}
          region={mapRegion}
        >
          <Marker
            coordinate={{
              latitude: mapRegion.latitude,
              longitude: mapRegion.longitude
            }}
          />
        </MapView>
      )}
      <TextInput
        style={styles.input}
        onChangeText={onChangeLocation}
        value={searchLocation}
        placeholder="Enter location here..."
      />
      <TouchableOpacity style={styles.button} onPress={findLocation}>
        <Text style={styles.buttonText}>Show</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: {
    width: "90%",
    alignItems: 'center',
    backgroundColor: '#0066ff', 
    padding: 10,
  },
  input: {
    width: "90%",
    borderBottomWidth: 1,  
    borderBottomColor: 'grey', 
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },

});
