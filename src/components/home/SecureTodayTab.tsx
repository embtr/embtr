import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Today } from 'src/components/today/Today';
import { CreateTask } from 'src/components/plan/task/CreateTask';

export const SecureTodayTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Today' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Today" component={Today} />
            <Stack.Screen name="CreateTask" component={CreateTask} />
        </Stack.Navigator>
    );
};