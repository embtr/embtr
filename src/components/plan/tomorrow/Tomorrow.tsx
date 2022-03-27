import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import RoutineController, { getTomorrow, RoutineModel } from 'src/controller/planning/RoutineController';
import { PlanningTask } from 'src/components/plan/tomorrow/PlanningTask';


export const Tomorrow = () => {
    const { colors } = useTheme();

    const [routines, setRoutines] = React.useState<RoutineModel[]>([]);

    const tomorrow = getTomorrow();
    const tomorrowCapitalized = tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1);

    useFocusEffect(
        React.useCallback(() => {
            RoutineController.getRoutinesForDay(getAuth().currentUser!.uid, tomorrow, setRoutines);
        }, [])
    );

    let routineViews: JSX.Element[] = [];
    routines.forEach(routine => {
        let checked = true;
        routineViews.push(
            <View key={routine.id} style={{ paddingBottom: 5 }}>
                <PlanningTask routine={routine} onChecked={() => { }} />
            </View>
        );
    });

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, textAlign: "center", fontSize: 17, paddingTop: 10 }}>
                    Tomorrow is
                    <Text style={{ color: colors.primary_border }}> {tomorrowCapitalized}</Text>
                </Text>

                <View>
                    <Text style={{ color: colors.text, textAlign: "center", fontSize: 10, paddingTop: 2 }}>
                        Starts in 11:30
                    </Text>
                </View>

                <View>
                    <Text style={{ color: colors.text, textAlign: "center", fontSize: 11, paddingTop: 4 }}>
                        <Text style={{ color: "red" }} >unlocked 🔓</Text>
                    </Text>
                </View>
            </View>

            <View style={{ flex: 9 }}>
                <Text style={{ color: colors.text, textAlign: "center", paddingBottom: 5 }}>
                    plan your day
                </Text>
                <View>
                    <ScrollView style={{ backgroundColor: colors.background_secondary, paddingTop: 5, height: 500 }}>
                        {routineViews}
                    </ScrollView>
                </View>

            </View>

        </View>
    );
};