import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserSettings } from 'src/components/profile/UserSettings';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { Profile } from 'src/components/profile/CurrentUserProfile';

const Stack = createNativeStackNavigator();

export const SecureUserTabStack = () => {
    const [componentIsMounted, setComponentIsMounted] = React.useState(false);

    React.useEffect(() => {
        setComponentIsMounted(true);
    }, []);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!componentIsMounted ? (
                <Stack.Screen name="Profile" component={LoadingPage} />
            ) :
                <Stack.Screen name="Profile" component={Profile} />
            }

            {!componentIsMounted ? (
                <Stack.Screen name="UserSettings" component={LoadingPage} />
            ) :
                <Stack.Screen name="UserSettings" component={UserSettings} />
            }

        </Stack.Navigator>
    );
};