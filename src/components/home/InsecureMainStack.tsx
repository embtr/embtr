import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { About } from 'src/static/About';
import { LandingPage } from 'src/components/landing/LandingPage';
import { Logout } from 'src/components/logout/Logout';
import { Routes } from 'src/navigation/RootStackParamList';
import { LoginModal } from 'src/components/login/LoginModal';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { RegisterModal } from 'src/components/login/RegisterModal';

const Stack = createStackNavigator();

export const InsecureMainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="LandingPage" component={LandingPage} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="About" component={About} />

            <Stack.Screen
                name={Routes.LOGIN_MODAL}
                component={LoginModal}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />

            <Stack.Screen
                name={Routes.REGISTER_MODAL}
                component={RegisterModal}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
        </Stack.Navigator>
    );
};
