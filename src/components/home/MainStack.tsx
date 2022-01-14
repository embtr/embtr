import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAppSelector } from 'src/redux/hooks';
import { getAccessLevel } from 'src/redux/user/GlobalState';
import { About } from 'src/static/About';
import { ReleaseNotes } from 'src/static/ReleaseNotes';
import { Dashboard } from 'src/components/home/Dashboard';
import { LandingPage } from 'src/components/landing/LandingPage';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import UserController from 'src/controller/user/UserController';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { Logout } from 'src/components/logout/Logout';

const Stack = createNativeStackNavigator();

export const MainStack = () => {
    const accessLevel = useAppSelector(getAccessLevel);
    const [userIsLoggedIn, setUserIsLoggedIn] = React.useState<boolean | null>(null);

    const [componentIsMounted, setComponentIsMounted] = React.useState(false);

    React.useEffect(() => {
        setComponentIsMounted(true);
    }, []);

    React.useEffect(() => {
        UserController.registerProfileUpdateListener();
    }, []);

    React.useEffect(() => {
        getCurrentUserUid((user: string) => {
            setUserIsLoggedIn(user !== null);
        });
    }, []);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!componentIsMounted ? (
                <Stack.Screen name="LandingPage" component={LoadingPage} />
            ) : userIsLoggedIn === null || accessLevel === undefined ? (
                <Stack.Screen name="LandingPage" component={LoadingPage} />
            ) : userIsLoggedIn !== true || accessLevel !== "beta_approved" ? (
                <Stack.Screen name="LandingPage" component={LandingPage} />
            ) : (
                <Stack.Screen name="Dashboard" component={Dashboard} />
            )}

            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen name="ReleaseNotes" component={ReleaseNotes} />

        </Stack.Navigator>
    );
};