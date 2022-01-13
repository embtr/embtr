import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { UserSearch } from 'src/components/profile/search/UserSearch';
import { UserProfile } from 'src/components/profile/UserProfile';
import { Timeline } from 'src/components/timeline/Timeline';

const Stack = createNativeStackNavigator();

export const SecureTimelineTabStack = () => {
    const [componentIsMounted, setComponentIsMounted] = React.useState(false);

    React.useEffect(() => {
        setComponentIsMounted(true);
    }, []);

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!componentIsMounted ? (
                <Stack.Screen name="Timeline" component={LoadingPage} />
            ) :
                <Stack.Screen name="Timeline" component={Timeline} />
            }

            {!componentIsMounted ? (
                <Stack.Screen name="UserSearch" component={LoadingPage} />
            ) :
                <Stack.Screen name="UserSearch" component={UserSearch} />
            }

            {!componentIsMounted ? (
                <Stack.Screen name="UserProfile" component={LoadingPage} />
            ) :
                <Stack.Screen name="UserProfile" component={UserProfile} />
            }

        </Stack.Navigator>
    );
};