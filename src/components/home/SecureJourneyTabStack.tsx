import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HabitJourney } from '../journey/HabitJourney';

export const SecureJourneyTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="HabitJourney" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HabitJourney" component={HabitJourney} />
        </Stack.Navigator>
    );
};
