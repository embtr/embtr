import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { PlannedDayResult, UserPost } from 'resources/schema';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentTab } from 'src/redux/user/GlobalState';
import { getNavigationHook } from 'src/util/navigation/NavigationHookProvider';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { getDatePretty } from 'src/util/DateUtility';
import { TaskCompleteSymbol } from 'src/components/common/task_symbols/TaskCompleteSymbol';
import { TaskFailedSymbol } from 'src/components/common/task_symbols/TaskFailedSymbol';
import { TaskInProgressSymbol } from 'src/components/common/task_symbols/TaskInProgressSymbol';

interface Props {
    userId: number;
}

export const UserDailyResultsWidget = ({ userId }: Props) => {
    const { colors } = useTheme();

    const currentTab = useAppSelector(getCurrentTab);
    const navigation = getNavigationHook(currentTab)();

    const [dailyResults, setDailyResults] = React.useState<PlannedDayResult[]>([]);

    const fetch = async () => {
        const dailyResults = await DailyResultController.getAllForUser(userId);
        if (dailyResults) {
            dailyResults.sort((a, b) => {
                const aDate = a.plannedDay?.date ?? new Date();
                const bDate = b.plannedDay?.date ?? new Date();
                return bDate.getTime() - aDate.getTime();
            });
            setDailyResults(dailyResults);
        }
    };

    React.useEffect(() => {
        fetch();
    }, []);

    const elements: JSX.Element[] = [];
    for (let i = 0; i < (dailyResults.length < 3 ? dailyResults.length : 3); i++) {
        const dailyResult = dailyResults[i];
        const plannedTasks = dailyResult.plannedDay?.plannedTasks;
        const completeCount =
            plannedTasks?.filter((task) => task.completedQuantity === task.quantity).length ?? 0;
        const incompleteCount =
            plannedTasks?.filter((task) => task.completedQuantity !== task.quantity).length ?? 0;
        const failedCount = plannedTasks?.filter((task) => task.status === 'FAILED').length ?? 0;

        const element = (
            <Pressable
                onPress={() => {
                    //@ts-ignore
                    navigation.navigate('DailyResultDetails', {
                        id: dailyResult.id,
                    });
                }}
            >
                <View
                    key={i}
                    style={{
                        padding: 10,
                        paddingTop: 12,
                        flexDirection: 'row',
                    }}
                >
                    <View style={{ flex: 1 }}>
                        <View>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_SEMI_BOLD,
                                    fontSize: 12,
                                }}
                            >
                                {getDatePretty(dailyResult.plannedDay?.date ?? new Date())}
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TaskCompleteSymbol small />
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        color: colors.secondary_text,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 12,
                                        lineHeight: 16,
                                    }}
                                >
                                    {completeCount} complete
                                </Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TaskInProgressSymbol small />
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        color: colors.secondary_text,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 12,
                                        lineHeight: 16,
                                    }}
                                >
                                    {incompleteCount} incomplete
                                </Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <TaskFailedSymbol small />

                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        color: colors.secondary_text,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 12,
                                        lineHeight: 16,
                                    }}
                                >
                                    {failedCount} failed
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ justifyContent: 'center', paddingLeft: 10 }}>
                        <View>
                            <Ionicons name={'chevron-forward'} size={14} color={colors.text} />
                        </View>
                    </View>
                </View>
            </Pressable>
        );

        elements.push(element);
    }

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                Daily Results
            </Text>

            <View style={{ width: '100%' }}>
                {elements.length > 0 && (
                    <View>
                        <View>{elements}</View>
                        <View style={{ width: '100%', paddingLeft: 10 }}>
                            <Text
                                onPress={() => {
                                    //@ts-ignore
                                    navigation.navigate('DailyResults', { userId: userId });
                                }}
                                style={{ color: colors.secondary_text, fontSize: 12 }}
                            >
                                view all..
                            </Text>
                        </View>
                    </View>
                )}
                {elements.length === 0 && (
                    <Text style={{ color: colors.secondary_text, paddingLeft: 5 }}>
                        no recent daily results...
                    </Text>
                )}
            </View>
        </WidgetBase>
    );
};
