import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Explore } from 'src/components/explore/Explore';
import { UserProfile } from 'src/components/profile/UserProfile';

const Stack = createNativeStackNavigator();

export const SecureExploreTab = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Explore" component={Explore} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
        </Stack.Navigator>
    );
};