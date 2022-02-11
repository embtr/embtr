import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Planning } from 'src/components/plan/Planning';
import { CreateRoutine } from 'src/components/plan/routine/CreateRoutine';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Planning" component={Planning} />
            <Stack.Screen name="CreateRoutine" component={CreateRoutine} />
        </Stack.Navigator>
    );
};