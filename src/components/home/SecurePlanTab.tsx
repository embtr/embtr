import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DailyResultDetails } from '../common/timeline/DailyResultDetails';
import { UserProfile } from '../profile/UserProfile';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="PlanMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
            <Stack.Screen name="UserProfile" component={UserProfile} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
        </Stack.Navigator>
    );
};
