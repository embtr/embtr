import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Tasks } from 'src/components/plan/tasks/Tasks';
import { CreateRoutine } from 'src/components/plan/routine/CreateRoutine';
import { PlanMain } from 'src/components/plan/PlanMain';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='PlanMain' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PlanMain" component={PlanMain} />
            <Stack.Screen name="Planning" component={Tasks} />
            <Stack.Screen name="CreateRoutine" component={CreateRoutine} />
        </Stack.Navigator>
    );
};