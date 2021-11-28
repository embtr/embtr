import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import tailwind from 'tailwind-rn';

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Welcome to embtr. Coming Soon! Follow our progress on <a href="https:www.twitter.com/_embtr">
        <Text style={tailwind('underline text-blue-600 hover:text-blue-800 visited:text-purple-600')}>
          Twitter 👋
        </Text>
        </a>.
      </Text>
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
