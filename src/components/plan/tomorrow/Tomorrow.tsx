import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import RoutineController, { getTomorrow, RoutineModel } from 'src/controller/planning/RoutineController';


export const Tomorrow = () => {
    const { colors } = useTheme();

    const [routines, setRoutines] = React.useState<RoutineModel[]>([]);

    const tomorrow = getTomorrow();
    const tomorrowCapitalized = tomorrow.charAt(0).toUpperCase() + tomorrow.slice(1);

    useFocusEffect(
        React.useCallback(() => {
            RoutineController.getRoutines(getAuth().currentUser!.uid, setRoutines);
        }, [])
    );

    return (
        <View style={{ flex: 1, flexDirection: "column" }}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, textAlign: "center", fontSize: 17, paddingTop: 10 }}>
                    Tomorrow is
                    <Text style={{ color: colors.primary_border }}> {tomorrowCapitalized}</Text>
                </Text>
            </View>

        </View>
    );
};