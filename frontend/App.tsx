import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PumpInfo {
  id: number;
  name: string;
  lat: number;
  lon: number;
}

type ApiResponse = {
  pump: PumpInfo;
  distance: number;
};

export default function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `http://localhost:8000/nearest?lat=${coords.latitude}&lon=${coords.longitude}`
          );
          setData(await res.json());
        } catch (err) {
          setError('Failed to fetch');
        }
      },
      () => setError('Location permission denied')
    );
  }, []);

  if (error) return <Text>{error}</Text>;
  if (!data) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{data.pump.name}</Text>
      <Text>{data.distance} meters away</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
