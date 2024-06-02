import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import moviesData from './dataMovies.json'; // Importando o JSON local

const App = () => {
  const [movieTitle, setMovieTitle] = useState("");
  const [movieDataState, setMovieDataState] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão de localização não concedida', 'Por favor, conceda permissão de localização para obter a localização.');
        return;
      }
      let locationData = await Location.getCurrentPositionAsync({});
      setLocation(locationData);
    })();
  }, []);

  const handleSearch = () => {
    if (movieTitle.trim() === "") {
      Alert.alert('Aviso', 'Por favor, insira um título de filme válido.');
      return;
    }

    // Procurar o filme correspondente na lista
    const foundMovie = moviesData.find(movie => movie.titulo.toLowerCase() === movieTitle.toLowerCase());

    if (foundMovie) {
      setMovieDataState(foundMovie);
    } else {
      Alert.alert('Erro', 'Filme não encontrado. Verifique o título e tente novamente.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Busca de Filmes</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do filme"
        value={movieTitle}
        onChangeText={(text) => setMovieTitle(text)}
      />
      <Button title="Buscar Filme" onPress={handleSearch} />
      {movieDataState && (
        <View style={styles.movieDetails}>
          <Text style={styles.movieTitle}>{movieDataState.titulo}</Text>
          <Text>Diretor: {movieDataState.diretor}</Text>
          <Text>Ano: {movieDataState.ano}</Text>
        </View>
      )}
      {location && (
        <View style={styles.locationDetails}>
          <Text style={styles.locationHeader}>Sua localização atual:</Text>
          <Text>Latitude: {location.coords.latitude}</Text>
          <Text>Longitude: {location.coords.longitude}</Text>
        </View>
      )}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Sua Localização"
          />
        </MapView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#fff',
  },
  movieDetails: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  movieTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  locationDetails: {
    marginVertical: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  locationHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  map: {
    width: '100%',
    height: 200,
    marginVertical: 20,
  },
});

export default App;
