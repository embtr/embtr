import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { About } from 'src/static/About';
import { ReleaseNotes } from 'src/static/ReleaseNotes';
import { Dashboard } from 'src/components/home/Dashboard';
import { Logout } from 'src/components/logout/Logout';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { Goggins } from 'src/static/events/goggins/Goggins';
import { GogginsRegister } from 'src/static/events/goggins/GogginsRegister';
import { GogginsSponsor } from 'src/static/events/goggins/GogginsSponsor';
import { GogginsDonate } from 'src/static/events/goggins/GogginsDonate';

const Stack = createNativeStackNavigator();

export const SecureMainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Loading" component={LoadingPage} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="ReleaseNotes" component={ReleaseNotes} />

            <Stack.Screen name="Goggins" component={Goggins} />
            <Stack.Screen name="GogginsRegister" component={GogginsRegister} />
            <Stack.Screen name="GogginsSponsor" component={GogginsSponsor} />
            <Stack.Screen name="GogginsDonate" component={GogginsDonate} />
        </Stack.Navigator>
    );
};