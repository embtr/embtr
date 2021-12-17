import React from 'react';
import { useColorScheme } from 'react-native-appearance';
import { ThemeProvider, Button } from 'react-native-elements';

const theme = {
  Button: {
    titleStyle: {
      color: 'red',
    },
  },
};

export default function App() {
    let colorScheme = useColorScheme();
  return (
    <ThemeProvider useDark={true} theme={theme}>
      <Button title="My Button" titleStyle={{ color: 'pink' }} />
    </ThemeProvider>
  );
};