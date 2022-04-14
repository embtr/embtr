import React from 'react';
import { View, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { SelectableDaysOfWeek } from 'src/components/plan/routine/SelectableDaysOfWeek';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { createDays, DaysModel, RoutineModel } from 'src/controller/planning/TaskController';

interface Props {
    selectedDaysOfWeek: DaysModel,
    setSelectedDaysOfWeek: Function,
    routines: RoutineModel[]
}

export const TasksSummaryHeader = ({selectedDaysOfWeek, setSelectedDaysOfWeek, routines} : Props) => {
    const { colors } = useTheme();

    return (
        <View>
            <View style={{ height: "auto", paddingTop: 5, paddingBottom: 5 }}>
                <View style={{ padding: 5 }}>
                    <Text style={{ color: colors.text, textAlign: "center", paddingBottom: 5 }}>
                        Tasks Summary
                    </Text>

                    <View style={{ flexDirection: "row", padding: 5 }}>
                        <Text style={{ flex: 1, color: colors.text, textAlign: "center" }}>
                            Total Tasks: {routines.length}
                        </Text>
                    </View>
                </View>
                <SelectableDaysOfWeek daysOfWeek={selectedDaysOfWeek} onDaysOfWeekUpdated={setSelectedDaysOfWeek} />
            </View>

            <HorizontalLine />
        </View>
    );
};