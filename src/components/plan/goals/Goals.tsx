import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Goal } from 'src/components/plan/goals/Goal';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';

export const Goals = () => {


    const [goals, setGoals] = React.useState<GoalModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            GoalController.getGoals(getAuth().currentUser!.uid, setGoals);
        }, [])
    );

    let goalViews: JSX.Element[] = [];
    goals.forEach(goal => {
        goalViews.push(
            <View key={goal.id} style={{ paddingBottom: 7.5, width: "100%", alignItems: "center" }}>
                <Goal goal={goal} />
            </View>
        );
    });

    return (
        <View style={{ height: "100%", width: "100%" }}>

            <ScrollView style={{ paddingTop: 7 }}>
                {goalViews}
            </ScrollView>
        </View>
    );
};