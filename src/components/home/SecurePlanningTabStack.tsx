import { PlanningMain } from 'src/components/challenge/PlanningMain';
import { ChallengeDetails } from '../common/timeline/challenges/ChallengeDetails';
import { createStackNavigator } from '@react-navigation/stack';
import { DailyResultDetails } from 'src/components/common/timeline/DailyResultDetails';

export const SecurePlanningTabStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="PlanningMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PlanningMain" component={PlanningMain} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
            <Stack.Screen name="ChallengeDetails" component={ChallengeDetails} />
        </Stack.Navigator>
    );
};
