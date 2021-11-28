import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to embtr. Coming Soon! Follow our progress on <a href="https:www.twitter.com/_embtr">twitter</a>.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
