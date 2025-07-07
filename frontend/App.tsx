import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface PumpInfo {
  id: number;
  name: string;
  lat: number;
  lon: number;
  distance?: number;
}

type ApiResponse = {
  pumps: PumpInfo[];
};

export default function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const res = await fetch(
            `http://localhost:8000/pumps?lat=${coords.latitude}&lon=${coords.longitude}`
          );
          setData(await res.json());
        } catch {
          setError('Failed to fetch');
        }
      },
      () => setError('Location permission denied')
    );
  }, []);

  if (error) return <Text>{error}</Text>;
  if (!data) return <Text>Loading...</Text>;

  const renderItem = ({ item }: { item: PumpInfo }) => (
    <View style={styles.item}>
      <Text style={styles.name}>{item.name}</Text>
      {item.distance !== undefined && (
        <Text>{item.distance} m away</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={data.pumps}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  item: {
    padding: 16,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
