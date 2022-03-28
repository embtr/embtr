import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { View, Text, ScrollView } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import RoutineController, { getTomorrow, RoutineModel } from 'src/controller/planning/RoutineController';
import { PlanningTask } from 'src/components/plan/tomorrow/PlanningTask';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { Plan } from 'src/components/plan/Plan';
import { Countdown } from 'src/components/common/time/Countdown';


export const Tomorrow = () => {
    const { colors } = useTheme();

    const [routines, setRoutines] = React.useState<RoutineModel[]>([]);
    const [taskViews, setTaskViews] = React.useState<JSX.Element[]>([]);
    const [locked, setLocked] = React.useState<boolean>(false);
    const [hours, setHours] = React.useState(24 - new Date().getHours());
    const [minutes, setMinutes] = React.useState(60 - new Date().getMinutes());
    const [seconds, setSeconds] = React.useState(60 - new Date().getSeconds());

    const tomorrow = getTomorrow();
    const tomorrowCapitalized = tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1);

    useFocusEffect(
        React.useCallback(() => {
            RoutineController.getRoutinesForDay(getAuth().currentUser!.uid, tomorrow, setRoutines);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => setSeconds(60 - new Date().getSeconds() - 1), 1000);
        }, [seconds])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (seconds == 59) {
                setMinutes(60 - new Date().getMinutes());
            }
        }, [seconds])
    );

    useFocusEffect(
        React.useCallback(() => {
            if (minutes == 59) {
                setHours(24 - new Date().getHours());
            }
        }, [minutes])
    );

    useFocusEffect(
        React.useCallback(() => {
            let routineViews: JSX.Element[] = [];
            routines.forEach(routine => {
                let checked = true;
                if (locked) {
                    routineViews.push(<View key={routine.id} style={{ paddingBottom: 5 }}><Plan routine={routine} /></View>);
                } else {
                    routineViews.push(<View key={routine.id} style={{ paddingBottom: 5 }}><PlanningTask routine={routine} onChecked={() => { }} /></View>);
                }
            });

            setTaskViews(routineViews);
        }, [locked, routines])
    );

    const toggleLock = () => {
        setLocked(!locked);
    };

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, textAlign: "center", fontSize: 17, paddingTop: 10 }}>
                    Tomorrow is
                    <Text style={{ color: colors.primary_border }}> {tomorrowCapitalized}</Text>
                </Text>

                <View>
                    <Text style={{ color: colors.text, textAlign: "center", fontSize: 10, paddingTop: 2 }}>
                        Starts in <Countdown />
                    </Text>
                </View>

                <View>
                    <Text style={{ color: colors.text, textAlign: "center", fontSize: 11, paddingTop: 4 }}>
                        <Text style={{ color: locked ? "green" : "red" }} >{locked ? "locked 🔒" : "unlocked 🔓"} </Text>
                    </Text>
                </View>
            </View>

            <View style={{ flex: 8 }}>
                <Text style={{ color: colors.text, textAlign: "center", paddingBottom: "1%" }}>
                    plan your day
                </Text>
                <ScrollView style={{ backgroundColor: colors.background_secondary, paddingTop: 5, height: "99%" }}>
                    {taskViews}
                </ScrollView>
            </View>

            <View style={{ flex: 1.5, alignContent: "center", justifyContent: "center", alignItems: "center" }}>
                <EmbtrButton buttonText={'Lock Plans 🔒'} callback={() => { toggleLock() }} />
            </View>
        </View>
    );
};