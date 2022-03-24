import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Planning } from 'src/components/plan/Planning';
import { CreateRoutine } from 'src/components/plan/routine/CreateRoutine';
import { PlanMain } from 'src/components/plan/PlanMain';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='PlanMain' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PlanMain" component={PlanMain} />
            <Stack.Screen name="Planning" component={Planning} />
            <Stack.Screen name="CreateRoutine" component={CreateRoutine} />
        </Stack.Navigator>
    );
};