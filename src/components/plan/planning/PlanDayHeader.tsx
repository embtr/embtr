import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { PlannedDay } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { Routes, TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getFireConfetti } from 'src/redux/user/GlobalState';
import { TIMELINE_CARD_PADDING, POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    plannedDay: PlannedDay;
    dayKey: string;
    hideComplete?: boolean;
}

export const PlanDayHeader = ({ plannedDay, dayKey, hideComplete }: Props) => {
    const { colors } = useTheme();
    const hasPlannedTasks = plannedDay.plannedTasks && plannedDay.plannedTasks.length > 0;
    const allHabitsAreComplete =
        hasPlannedTasks &&
        plannedDay.plannedTasks?.reduce(
            (acc, task) => acc && (task.completedQuantity ?? 0) >= (task.quantity ?? 1),
            true
        );
    const plannedDayResultsAreShared = (plannedDay.plannedDayResults?.length ?? 0) > 0;
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();
    const fireConfetti = useAppSelector(getFireConfetti);

    let header = undefined;
    if (allHabitsAreComplete) {
        header = (
            <View
                style={{
                    padding: TIMELINE_CARD_PADDING / 2,
                    marginBottom: TIMELINE_CARD_PADDING,
                    borderColor: '#404040',
                    backgroundColor: '#343434',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: 5,
                }}
            >
                <Text
                    style={{
                        lineHeight: 20,
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                        textAlign: 'center',
                    }}
                >
                    All of today's habits are complete 🎉
                </Text>

                <View style={{ height: TIMELINE_CARD_PADDING }} />
                {!plannedDayResultsAreShared ? (
                    <TouchableOpacity
                        onPress={async () => {
                            if (plannedDay.id) {
                                await DailyResultController.create(plannedDay.id);
                                await PlannedDayController.prefetchPlannedDayData(dayKey);
                                fireConfetti();
                            }
                        }}
                        style={{
                            backgroundColor: colors.accent_color,
                            borderRadius: 2.5,
                        }}
                    >
                        <Text
                            style={{
                                paddingVertical: TIMELINE_CARD_PADDING / 8,
                                lineHeight: 20,
                                color: colors.text,
                                textAlign: 'center',
                                fontFamily: POPPINS_REGULAR,
                            }}
                        >
                            Share your results
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <View
                        style={{
                            flexDirection: 'row',
                            alignContent: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            onPress={() => {
                                if (
                                    (plannedDay.plannedDayResults?.length ?? 0) < 1 ||
                                    plannedDay.plannedDayResults?.[0]?.id === undefined
                                ) {
                                    return;
                                }

                                const id = plannedDay.plannedDayResults[0].id;
                                navigation.navigate(Routes.DAILY_RESULT_DETAILS, {
                                    id,
                                });
                            }}
                            style={{ color: colors.link, fontFamily: POPPINS_REGULAR }}
                        >
                            View today's results
                        </Text>
                    </View>
                )}
            </View>
        );
    } else if (!hasPlannedTasks) {
        header = (
            <View
                style={{
                    padding: TIMELINE_CARD_PADDING / 2,
                    marginBottom: TIMELINE_CARD_PADDING,
                    borderColor: '#404040',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: 5,
                }}
            >
                <Text
                    style={{
                        lineHeight: 20,
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                    }}
                >
                    No habits planned for today
                </Text>
            </View>
        );
    }

    return header;
};
