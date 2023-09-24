import { About } from 'src/static/About';
import { Dashboard } from 'src/components/home/Dashboard';
import { Logout } from 'src/components/logout/Logout';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { AddHabitCategories } from '../plan/habit/AddHabitCategories';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { AddHabitCategory } from '../plan/habit/AddHabitCategory';
import { CreateEditScheduledHabit } from '../plan/habit/CreateEditScheduledHabit';

const Stack = createStackNavigator();

export const SecureMainStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Dashboard" component={Dashboard} />
            <Stack.Screen name="Loading" component={LoadingPage} />
            <Stack.Screen name="Logout" component={Logout} />
            <Stack.Screen name="About" component={About} />
            <Stack.Screen
                name="AddHabitCategories"
                component={AddHabitCategories}
                options={{ ...TransitionPresets.ModalSlideFromBottomIOS }}
            />
            <Stack.Screen name="AddHabitCategory" component={AddHabitCategory} />
            <Stack.Screen name="CreateEditScheduledHabit" component={CreateEditScheduledHabit} />
        </Stack.Navigator>
    );
};
