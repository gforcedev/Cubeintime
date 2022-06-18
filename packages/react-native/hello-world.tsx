import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';
import { trpc } from '@zart/react/trpc';

export function HelloWorld() {
  const posts = trpc.useQuery([
    'hello',
    {
      name: 'nativetest',
    },
  ]);

  if (posts.data)
    return (
      <SafeAreaView style={styles.container}>
        <Text>{posts.data}</Text>
      </SafeAreaView>
    );

  return (
    <SafeAreaView style={styles.container}>
      <Text>Loading...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    flex: 1,
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
  },
});
