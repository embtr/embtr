import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from 'src/redux/hooks';
import { userIsSet } from 'src/redux/user/UserSlice';
import { Dashboard } from 'src/components/dashboard/dashboard';
import { Home } from 'src/components/home/home';
import { About } from 'src/static/About';
import { ReleaseNotes } from 'src/static/ReleaseNotes';

const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ['https://embtr.com', 'embtr://'],
    config: {
        screens: {
            Home: '',
            Dashboard: 'dashboard',
            About: 'about',
            ReleaseNotes: 'releaseNotes'
        }
    },
};

export const Main = () => {
    const userIsLoggedIn: boolean = useAppSelector(userIsSet);

    // https://reactnavigation.org/docs/auth-flow/
    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!userIsLoggedIn ? (
                    <Stack.Screen name="Home" component={Home} />
                ) : (
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                )}

                <Stack.Screen name="About" component={About} />
                <Stack.Screen name="ReleaseNotes" component={ReleaseNotes} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};