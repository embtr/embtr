import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserSettings } from 'src/components/profile/UserSettings';
import { CurrentUserProfile } from 'src/components/profile/CurrentUserProfile';
import { PillarsConfiguration } from 'src/components/profile/profile_component/pillar/PillarsConfiguration';

const Stack = createNativeStackNavigator();

export const SecureUserTabStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Profile" component={CurrentUserProfile} />
            <Stack.Screen name="UserSettings" component={UserSettings} />
            <Stack.Screen name="PillarsConfiguration" component={PillarsConfiguration} />
        </Stack.Navigator>
    );
};