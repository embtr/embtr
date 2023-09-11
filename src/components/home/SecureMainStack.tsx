import { About } from 'src/static/About';
import { Dashboard } from 'src/components/home/Dashboard';
import { Logout } from 'src/components/logout/Logout';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { AddTasks } from '../plan/planning/AddTasks';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';

const Stack = createStackNavigator();

export const SecureMainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Loading" component={LoadingPage} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen
                name="AddTasks"
                component={AddTasks}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
        </Stack.Navigator>
    );
};
