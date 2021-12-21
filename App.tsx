import React from 'react';
import { AppearanceProvider } from 'react-native-appearance';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './src/components/theme/ThemeProvider';
import { Home } from './src/components/home/home';
import { Login } from './src/components/login/Login';

const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ['https://embtr.com', 'embtr://'],
    config: {
      screens: {
        Home: '',
        Login: 'login',
      }
    },
  };

export default function App() {
    return (
        <React.StrictMode>
            <AppearanceProvider>
                <ThemeProvider>
                        <NavigationContainer linking={linking}>
                            <Stack.Navigator screenOptions={{ headerShown: false }}>
                                <Stack.Screen name="Home" component={Home} />
                                <Stack.Screen name="Login" component={Login} />
                            </Stack.Navigator>
                        </NavigationContainer>
                </ThemeProvider>
            </AppearanceProvider>
        </React.StrictMode>
    );
};