import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ManageHabitsOld } from '../manage_habits/ManageHabitsOld';

export const SecureMyHabitsTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="MyHabits" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MyHabits" component={ManageHabitsOld} />
        </Stack.Navigator>
    );
};
