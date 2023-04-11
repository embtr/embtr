import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { About } from 'src/static/About';
import { LandingPage } from 'src/components/landing/LandingPage';
import { Logout } from 'src/components/logout/Logout';

const Stack = createNativeStackNavigator();

export const InsecureMainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LandingPage" component={LandingPage} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="About" component={About} />
        </Stack.Navigator>
    );
};
