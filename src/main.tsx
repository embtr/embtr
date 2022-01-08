import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from 'src/redux/hooks';
import { userIsSet } from 'src/redux/user/UserSlice';
import { About } from 'src/static/About';
import { ReleaseNotes } from 'src/static/ReleaseNotes';
import { Dashboard } from 'src/components/home/home';
import { LandingPage } from 'src/components/landing/LandingPage';
import { UserSettings } from 'src/components/profile/UserSettings';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ['https://embtr.com', 'embtr://'],
    config: {
        screens: {
            Home: '',
            Dashboard: 'dashboard',
            About: 'about',
            ReleaseNotes: 'releaseNotes',
            UserSettings: 'userSettings'
        }
    },
};

export const Main = () => {
    const [userIsLoggedIn, setUserIsLoggedIn] = React.useState(false);

    onAuthStateChanged(getAuth(), (user) => {
        if (user) {
            setUserIsLoggedIn(true);
        } else {
            setUserIsLoggedIn(false);
        }
    });

    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!userIsLoggedIn ? (
                    <Stack.Screen name="Home" component={LandingPage} />
                ) : (
                    <Stack.Screen name="Dashboard" component={Dashboard} />
                )}

                {userIsLoggedIn && <Stack.Screen name="UserSettings" component={UserSettings} />}
                <Stack.Screen name="About" component={About} />
                <Stack.Screen name="ReleaseNotes" component={ReleaseNotes} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};