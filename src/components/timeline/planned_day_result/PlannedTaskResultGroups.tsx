import { View, Text } from 'react-native';
import { PADDING_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { PlannedDayResult, PlannedTask } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedDayResultCardElement } from './PlannedDayResultCardElement';

interface Props {
    plannedDayResult: PlannedDayResult;
    limit?: number;
}

export const PlannedTaskResultGroups = ({ plannedDayResult, limit }: Props) => {
    const colors = useTheme().colors;

    const allPlannedTaskGroups: Map<number, PlannedTask[]> = new Map();
    plannedDayResult.plannedDay?.plannedTasks?.forEach((plannedTask) => {
        const scheduledHabitId = plannedTask.scheduledHabitId ?? 0;

        if (allPlannedTaskGroups.has(scheduledHabitId)) {
            allPlannedTaskGroups.get(scheduledHabitId)?.push(plannedTask);
        } else {
            allPlannedTaskGroups.set(scheduledHabitId, [plannedTask]);
        }
    });

    const limitedPlannedTaskGroups = new Map<number, PlannedTask[]>();
    let count = 0;
    allPlannedTaskGroups.forEach((plannedTasks, key) => {
        if (count++ < (limit ?? allPlannedTaskGroups.size)) {
            limitedPlannedTaskGroups.set(key, plannedTasks);
        }
    });

    const plannedTaskViews: JSX.Element[] = [];
    for (const plannedTask of limitedPlannedTaskGroups.entries()) {
        const isLast = plannedTask[0] === Array.from(limitedPlannedTaskGroups.keys()).pop();
        plannedTaskViews.push(
            <View
                style={{
                    paddingBottom: isLast ? 0 : PADDING_MEDIUM,
                }}
                key={plannedTask[0]}
            >
                <PlannedDayResultCardElement plannedTasks={plannedTask[1]} />
            </View>
        );
    }

    const andMoreCount = allPlannedTaskGroups.size - limitedPlannedTaskGroups.size;

    return (
        <View>
            {plannedTaskViews}
            {andMoreCount > 0 && (
                <Text
                    style={{
                        color: colors.secondary_text,
                        fontSize: 12,
                        fontFamily: POPPINS_REGULAR,
                    }}
                >
                    ... and {andMoreCount} more
                </Text>
            )}
        </View>
    );
};
