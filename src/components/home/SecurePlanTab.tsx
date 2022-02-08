import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Planning } from 'src/components/plan/Planning';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Planning" component={Planning} />
        </Stack.Navigator>
    );
};