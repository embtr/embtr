import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_MEDIUM, POPPINS_MEDIUM } from 'src/util/constants';
import { DailyResultCardElement } from './DailyResultCardElement';
import { PlannedDayResult as PlannedDayResultModel, PlannedTask } from 'resources/schema';
import { SvgUri } from 'react-native-svg';
import { Constants } from 'resources/types/constants/constants';

interface Props {
    plannedDayResult: PlannedDayResultModel;
}

export const DailyResultBody = ({ plannedDayResult }: Props) => {
    const { colors } = useTheme();

    const challengeName = plannedDayResult.plannedDay?.challengeParticipant?.[0]?.challenge?.name;
    const svgUrl =
        plannedDayResult.plannedDay?.challengeParticipant?.[0]?.challenge?.challengeRewards?.[0]
            ?.remoteImageUrl;

    const groupedPlannedTasks: Map<number, PlannedTask[]> = new Map();
    plannedDayResult.plannedDay?.plannedTasks?.forEach((plannedTask) => {
        const scheduledHabitId = plannedTask.scheduledHabitId ?? 0;

        if (groupedPlannedTasks.has(scheduledHabitId)) {
            groupedPlannedTasks.get(scheduledHabitId)?.push(plannedTask);
        } else {
            groupedPlannedTasks.set(scheduledHabitId, [plannedTask]);
        }
    });

    const plannedTaskViews: JSX.Element[] = [];
    let count = 0;
    groupedPlannedTasks.forEach((plannedTasks) => {
        const isLast = count++ === groupedPlannedTasks.size - 1;
        plannedTaskViews.push(
            <View
                style={{
                    paddingBottom: isLast ? 0 : PADDING_MEDIUM,
                }}
                key={plannedTasks[0].id}
            >
                <DailyResultCardElement plannedTasks={plannedTasks} />
            </View>
        );
    });

    let completedCount = 0;
    plannedDayResult.plannedDay?.plannedTasks?.forEach((plannedTask) => {
        if (plannedTask.status === Constants.HabitStatus.COMPLETE) {
            completedCount++;
        }
    });

    return (
        <View style={{}}>
            {plannedDayResult.description && (
                <Text style={[{ textAlign: 'left', paddingBottom: 10, color: colors.text }]}>
                    {plannedDayResult.description}
                </Text>
            )}

            {svgUrl && (
                <View style={{ paddingBottom: 10, paddingTop: 2.5 }}>
                    <View
                        style={{
                            paddingVertical: 7.5,
                            paddingLeft: 7.5,
                            borderWidth: 1,
                            borderRadius: 3,
                            borderColor: colors.secondary_text,
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <SvgUri width={50} height={50} uri={svgUrl ?? ''} />
                            <View style={{ paddingLeft: 7.5 }}>
                                <Text style={{ color: colors.text, fontFamily: POPPINS_MEDIUM }}>
                                    Challenge Complete
                                </Text>
                                <Text
                                    style={{
                                        color: colors.tab_selected,
                                        fontFamily: POPPINS_MEDIUM,
                                    }}
                                >
                                    {challengeName}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            <View style={{}}>{plannedTaskViews}</View>
        </View>
    );
};
