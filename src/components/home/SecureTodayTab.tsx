import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Planning } from 'src/components/plan/planning/Planning';
import { CreateOneTimeTask } from 'src/components/plan/task/CreateOneTimeTask';
import { EditOneTimeTask } from 'src/components/plan/EditOneTimeTask';

export const SecureTodayTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Today' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="CreateOneTimeTask" component={CreateOneTimeTask} />
            <Stack.Screen name="EditOneTimeTask" component={EditOneTimeTask} />
        </Stack.Navigator>
    );
};