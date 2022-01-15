import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserSettings } from 'src/components/profile/UserSettings';
import { CurrentUserProfile } from 'src/components/profile/CurrentUserProfile';

const Stack = createNativeStackNavigator();

export const SecureUserTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={CurrentUserProfile} />
            <Stack.Screen name="UserSettings" component={UserSettings} />
        </Stack.Navigator>
    );
};