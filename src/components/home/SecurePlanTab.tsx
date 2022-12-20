import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanMain } from 'src/components/plan/PlanMain';
import { TaskDetails } from 'src/components/plan/tasks/TaskDetails';
import { GoalDetails } from 'src/components/plan/goals/GoalDetails';
import { PlanDay } from '../plan/planning/PlanDay';
import { CreateEditHabit } from '../plan/CreateEditHabit';
import { CreateEditOneTimeTask } from '../plan/task/CreateEditOneTimeTask';
import { CreateEditGoal } from '../plan/goals/CreateEditGoal';
import { PlanPreviews } from '../plan/PlanPreviews';
import { Habits } from '../plan/tasks/Habits';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="PlanMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PlanMain" component={PlanMain} />
            <Stack.Screen name="PlanPreviews" component={PlanPreviews} />
            <Stack.Screen name="Habits" component={Habits} />
            <Stack.Screen name="TaskDetails" component={TaskDetails} />
            <Stack.Screen name="CreateEditOneTimeTask" component={CreateEditOneTimeTask} />
            <Stack.Screen name="CreateEditGoal" component={CreateEditGoal} />
            <Stack.Screen name="GoalDetails" component={GoalDetails} />
            <Stack.Screen name="PlanDay" component={PlanDay} />
            <Stack.Screen name="CreateEditHabit" component={CreateEditHabit} />
        </Stack.Navigator>
    );
};
