import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Tasks } from 'src/components/plan/tasks/Tasks';
import { CreateTask } from 'src/components/plan/task/CreateTask';
import { PlanMain } from 'src/components/plan/PlanMain';
import { TaskDetails } from 'src/components/plan/tasks/TaskDetails';
import { CreateGoal } from 'src/components/plan/goals/CreateGoal';

export const SecurePlanTabStack = () => {
    const Stack = createNativeStackNavigator();

    return (
        <Stack.Navigator initialRouteName='PlanMain' screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PlanMain" component={PlanMain} />
            <Stack.Screen name="Planning" component={Tasks} />
            <Stack.Screen name="TaskDetails" component={TaskDetails} />
            <Stack.Screen name="CreateTask" component={CreateTask} />
            <Stack.Screen name="CreateGoal" component={CreateGoal} />
        </Stack.Navigator>
    );
};