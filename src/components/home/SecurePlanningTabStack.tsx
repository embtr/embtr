import { PlanningMain } from 'src/components/challenge/PlanningMain';
import { createStackNavigator } from '@react-navigation/stack';
import { DailyResultDetails } from 'src/components/common/timeline/DailyResultDetails';
import { ManageHabits } from '../manage_habits/ManageHabits';
import { HabitJourney } from '../journey/HabitJourney';
import { Routes } from 'src/navigation/RootStackParamList';
import { ChallengeDetailsView } from '../common/timeline/challenges/ChallengeDetailsView';

export const SecurePlanningTabStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Journey" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HabitJourney" component={HabitJourney} />
            <Stack.Screen name="ManageHabits" component={ManageHabits} />
            <Stack.Screen name="PlanningMain" component={PlanningMain} />
            <Stack.Screen name="DailyResultDetails" component={DailyResultDetails} />
            <Stack.Screen name={Routes.CHALLENGE_DETAILS_VIEW} component={ChallengeDetailsView} />
        </Stack.Navigator>
    );
};
