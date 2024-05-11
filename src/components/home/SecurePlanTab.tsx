import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserProfile } from '../profile/UserProfile';
import { Routes } from 'src/navigation/RootStackParamList';
import { PlannedDayResultDetails } from '../timeline/planned_day_result/PlannedDayResultDetails';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="PlanMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen
                name={Routes.PLANNED_DAY_RESULT_DETAILS}
                component={PlannedDayResultDetails}
            />
        </Stack.Navigator>
    );
};
