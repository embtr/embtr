import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanDay } from '../plan/planning/PlanDay';
import { Today } from '../today/Today';
import { ConfigureWidgets } from '../widgets/configure/ConfigureWidgets';

export const SecureTodayTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Today" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Today" component={Today} />
            <Stack.Screen name="PlanDay" component={PlanDay} />
            <Stack.Screen name="ConfigureWidgets" component={ConfigureWidgets} />
        </Stack.Navigator>
    );
};
