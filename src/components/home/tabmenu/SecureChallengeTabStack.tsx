import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanMain } from 'src/components/plan/PlanMain';
import { DailyResultDetails } from 'src/components/common/timeline/DailyResultDetails';
import { UserProfile } from 'src/components/profile/UserProfile';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="PlanMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PlanMain" component={PlanMain} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
        </Stack.Navigator>
    );
};
