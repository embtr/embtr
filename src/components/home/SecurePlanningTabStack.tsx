import { PlanningMain } from 'src/components/challenge/PlanningMain';
import { createStackNavigator } from '@react-navigation/stack';
import { ManageHabits } from '../manage_habits/ManageHabits';
import { HabitJourney } from '../journey/HabitJourney';
import { Routes } from 'src/navigation/RootStackParamList';
import { ChallengeDetailsView } from '../common/timeline/challenges/ChallengeDetailsView';
import { PlannedDayResultDetails } from '../timeline/planned_day_result/PlannedDayResultDetails';

export const SecurePlanningTabStack = () => {
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator initialRouteName="Journey" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HabitJourney" component={HabitJourney} />
            <Stack.Screen name="ManageHabits" component={ManageHabits} />
            <Stack.Screen name="PlanningMain" component={PlanningMain} />
            <Stack.Screen
                name={Routes.PLANNED_DAY_RESULT_DETAILS}
                component={PlannedDayResultDetails}
            />
            <Stack.Screen name={Routes.CHALLENGE_DETAILS_VIEW} component={ChallengeDetailsView} />
        </Stack.Navigator>
    );
};
