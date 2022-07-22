import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Today } from 'src/components/today/Today';
import { CreateOneTimeTask } from 'src/components/plan/task/CreateOneTimeTask';

export const SecureTodayTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Today' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Today" component={Today} />
            <Stack.Screen name="CreateOneTimeTask" component={CreateOneTimeTask} />
        </Stack.Navigator>
    );
};