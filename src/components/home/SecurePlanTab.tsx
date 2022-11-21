import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Tasks } from 'src/components/plan/tasks/Tasks';
import { PlanMain } from 'src/components/plan/PlanMain';
import { TaskDetails } from 'src/components/plan/tasks/TaskDetails';
import { CreateGoal } from 'src/components/plan/goals/CreateGoal';
import { GoalDetails } from 'src/components/plan/goals/GoalDetails';
import { CreateOneTimeTask } from 'src/components/plan/task/CreateOneTimeTask';
import { PlanDay } from '../plan/planning/PlanDay';
import { CreateEditHabit } from '../plan/CreateEditHabit';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="PlanMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PlanMain" component={PlanMain} />
            <Stack.Screen name="Planning" component={Tasks} />
            <Stack.Screen name="TaskDetails" component={TaskDetails} />
            <Stack.Screen name="CreateOneTimeTask" component={CreateOneTimeTask} />
            <Stack.Screen name="CreateGoal" component={CreateGoal} />
            <Stack.Screen name="GoalDetails" component={GoalDetails} />
            <Stack.Screen name="PlanDay" component={PlanDay} />
            <Stack.Screen name="CreateEditHabit" component={CreateEditHabit} />
        </Stack.Navigator>
    );
};
