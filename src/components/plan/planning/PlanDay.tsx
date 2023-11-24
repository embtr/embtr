import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { MemoizedPlannableTaskImproved } from '../PlannableTaskImproved';

interface Props {
    onSharePlannedDayResults: Function;
}

export const PlanDay = ({ onSharePlannedDayResults }: Props) => {
    const plannedDay = PlannedDayCustomHooks.useSelectedPlannedDay();

    const { colors } = useTheme();

    let taskViews: JSX.Element[] = [];

    plannedDay.data?.plannedTasks?.forEach((plannedTask) => {
        if (!plannedTask.active) {
            return;
        }

        const key =
            'plannedDay' +
            plannedTask.plannedDayId +
            '_plannedTask' +
            plannedTask.id +
            '_scheduledHabit' +
            plannedTask.scheduledHabitId +
            '_timeOfDay' +
            plannedTask.timeOfDayId;

        taskViews.push(
            <View
                key={key}
                style={{
                    alignItems: 'center',
                    width: '100%',
                    paddingBottom: TIMELINE_CARD_PADDING,
                }}
            >
                <MemoizedPlannableTaskImproved plannedTask={plannedTask} />
            </View>
        );
    });

    if (taskViews === undefined) {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ color: colors.secondary_text }}>
                    You have no activities planned. Let's change that!
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <View
                style={{
                    paddingTop: 5,
                    height: '97%',
                    width: '100%',
                }}
            >
                {/* Morning */}
                <View
                    style={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {taskViews}
                </View>
            </View>
        </View>
    );
};
