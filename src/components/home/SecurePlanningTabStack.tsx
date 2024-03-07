import { PlanningMain } from 'src/components/challenge/PlanningMain';
import { ChallengeDetails } from '../common/timeline/challenges/ChallengeDetails';
import { createStackNavigator } from '@react-navigation/stack';
import { DailyResultDetails } from 'src/components/common/timeline/DailyResultDetails';
import { ManageHabitsOld } from '../manage_habits/ManageHabitsOld';
import { Journey } from '../journey/Journey';

export const SecurePlanningTabStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Journey" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Journey" component={Journey} />
            <Stack.Screen name="ManageHabits" component={ManageHabitsOld} />
            <Stack.Screen name="PlanningMain" component={PlanningMain} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
            <Stack.Screen name="ChallengeDetails" component={ChallengeDetails} />
        </Stack.Navigator>
    );
};
