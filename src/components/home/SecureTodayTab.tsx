import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text } from 'react-native';
import { Today } from 'src/components/today/Today';

export const SecureTodayTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='Today' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Today" component={Today} />
        </Stack.Navigator>
    );
};