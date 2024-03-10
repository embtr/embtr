import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ManageHabits } from '../manage_habits/ManageHabits';

export const SecureMyHabitsTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="MyHabits" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MyHabits" component={ManageHabits} />
        </Stack.Navigator>
    );
};
