import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Linking } from 'react-native';
import tailwind from 'tailwind-rn';

const TWITTER_LINK = "https://www.twitter.com/_embtr"

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={tailwind('text-center')}>
        Welcome to embtr.
        {"\n"}
        {"\n"}
        Coming Soon! Follow our progress on{" "}
        <Text style={tailwind('underline text-blue-600')} onPress={() => Linking.openURL(TWITTER_LINK)}>
          Twitter 🐦
        </Text>.
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
