import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Journey } from '../journey/Journey';

export const SecureJourneyTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Journey" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Journey" component={Journey} />
        </Stack.Navigator>
    );
};
