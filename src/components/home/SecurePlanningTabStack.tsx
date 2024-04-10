import { PlanningMain } from 'src/components/challenge/PlanningMain';
import { ChallengeDetails } from '../common/timeline/challenges/ChallengeDetails';
import { createStackNavigator } from '@react-navigation/stack';
import { DailyResultDetails } from 'src/components/common/timeline/DailyResultDetails';
import { ManageHabits } from '../manage_habits/ManageHabits';
import { HabitJourney } from '../journey/HabitJourney';
import { Routes } from 'src/navigation/RootStackParamList';

export const SecurePlanningTabStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Journey" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HabitJourney" component={HabitJourney} />
            <Stack.Screen name="ManageHabits" component={ManageHabits} />
            <Stack.Screen name="PlanningMain" component={PlanningMain} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
            <Stack.Screen name={Routes.CHALLENGE_DETAILS} component={ChallengeDetails} />
        </Stack.Navigator>
    );
};
