import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanMain } from 'src/components/plan/PlanMain';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="PlanMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PlanMain" component={PlanMain} />
        </Stack.Navigator>
    );
};
