import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from 'src/redux/hooks';
import { getAccessLevel } from 'src/redux/user/GlobalState';
import { About } from 'src/static/About';
import { ReleaseNotes } from 'src/static/ReleaseNotes';
import { Dashboard } from 'src/components/home/Dashboard';
import { LandingPage } from 'src/components/landing/LandingPage';
import { User } from 'firebase/auth';
import { registerAuthStateListener } from 'src/session/CurrentUserProvider';
import UserController from 'src/controller/user/UserController';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { Logout } from 'src/components/logout/Logout';

const Stack = createNativeStackNavigator();

const linking = {
    prefixes: ['https://embtr.com', 'embtr://'],
    config: {
        screens: {
            LandingPage: '',
            Dashboard: 'dashboard',
            About: 'about',
            ReleaseNotes: 'releaseNotes',
            UserSettings: 'userSettings',
            UserSearch: 'userSearch',
            Profile: 'profile',
            UserProfile: 'user',
            Logout: 'logout',
        }
    },
};

export const Main = () => {
    const accessLevel = useAppSelector(getAccessLevel);
    const [userIsLoggedIn, setUserIsLoggedIn] = React.useState(false);

    const [componentIsMounted, setComponentIsMounted] = React.useState(false);

    React.useEffect(() => {
        setComponentIsMounted(true);
    }, []);

    React.useEffect(() => {
        UserController.registerProfileUpdateListener();
    }, []);

    React.useEffect(() => {
        registerAuthStateListener((user: User) => {
            setUserIsLoggedIn(user !== null);
        });
    }, []);

    const isSuccessfullyLoggedIn = () => {
        return accessLevel === "beta_approved" && userIsLoggedIn;
    }

    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!componentIsMounted ? (
                    <Stack.Screen name="LandingPage" component={LoadingPage} />
                ) :
                    !isSuccessfullyLoggedIn() ? (
                        <Stack.Screen name="LandingPage" component={LandingPage} />
                    ) : (
                        <Stack.Screen name="Dashboard" component={Dashboard} />
                    )}

                <Stack.Screen name="Logout" component={Logout} />
                <Stack.Screen name="About" component={About} />
                <Stack.Screen name="ReleaseNotes" component={ReleaseNotes} />

            </Stack.Navigator>
        </NavigationContainer>
    );
};