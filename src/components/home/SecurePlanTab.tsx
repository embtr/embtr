import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PlanMain } from 'src/components/plan/PlanMain';
import { TaskDetails } from 'src/components/plan/tasks/TaskDetails';
import { GoalDetails } from 'src/components/plan/goals/GoalDetails';
import { CreateEditHabit } from '../plan/CreateEditHabit';
import { CreateEditOneTimeTask } from '../plan/task/CreateEditOneTimeTask';
import { CreateEditGoal } from '../plan/goals/CreateEditGoal';
import { PlanPreviews } from '../plan/PlanPreviews';
import { Habits } from '../plan/tasks/Habits';
import { Goals } from '../plan/goals/Goals';
import { Pillars } from '../plan/pillars/Pillars';
import { CreateEditPillar } from '../profile/profile_component/pillar/CreateEditPillar';
import { PillarDetails } from '../profile/profile_component/pillar/PillarDetails';
import { Routines } from '../plan/routines/Routines';
import { CreateEditRoutine } from '../plan/routines/CreateEditRoutine';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName="PlanMain" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PlanMain" component={PlanMain} />
            <Stack.Screen name="PlanPreviews" component={PlanPreviews} />
            <Stack.Screen name="Habits" component={Habits} />
            <Stack.Screen name="Routines" component={Routines} />
            <Stack.Screen name="TaskDetails" component={TaskDetails} />
            <Stack.Screen name="CreateEditOneTimeTask" component={CreateEditOneTimeTask} />
            <Stack.Screen name="CreateEditGoal" component={CreateEditGoal} />
            <Stack.Screen name="GoalDetails" component={GoalDetails} />
            <Stack.Screen name="Goals" component={Goals} />
            <Stack.Screen name="CreateEditHabit" component={CreateEditHabit} />
            <Stack.Screen name="Pillars" component={Pillars} />
            <Stack.Screen name="PillarDetails" component={PillarDetails} />
            <Stack.Screen name="CreateEditPillar" component={CreateEditPillar} />
            <Stack.Screen name="CreateEditRoutine" component={CreateEditRoutine} />
        </Stack.Navigator>
    );
};
