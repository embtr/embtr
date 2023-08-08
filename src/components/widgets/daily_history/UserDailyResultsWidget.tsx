import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { POPPINS_MEDIUM, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentTab } from 'src/redux/user/GlobalState';
import { getNavigationHook } from 'src/util/navigation/NavigationHookProvider';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';
import { CompletedHabits } from 'src/components/timeline/card_components/CompletedHabits';
import { getDatePretty } from 'src/util/DateUtility';

interface Props {
    userId: number;
}

export const UserDailyResultsWidget = ({ userId }: Props) => {
    const { colors } = useTheme();

    const currentTab = useAppSelector(getCurrentTab);
    const navigation = getNavigationHook(currentTab)();

    const [plannedDayResultSummaries, setPlannedDayResultSummaries] = React.useState<
        PlannedDayResultSummary[]
    >([]);

    const fetch = async () => {
        const summaries = (await DailyResultController.getAllSummariesForUser(userId)) ?? [];
        setPlannedDayResultSummaries(summaries);
    };

    React.useEffect(() => {
        fetch();
    }, []);

    const elements: JSX.Element[] = [];
    for (
        let i = 0;
        i < (plannedDayResultSummaries.length < 3 ? plannedDayResultSummaries.length : 3);
        i++
    ) {
        const summary = plannedDayResultSummaries[i];

        const element = (
            <Pressable
                onPress={() => {
                    navigation.navigate('DailyResultDetails', {
                        id: summary.plannedDayResult.id ?? 0,
                    });
                }}
            >
                <View
                    key={i}
                    style={{
                        flexDirection: 'row',
                    }}
                >
                    <View
                        style={{
                            paddingBottom: 16,
                            flex: 1,
                        }}
                    >
                        <View style={{ paddingLeft: 12 }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_SEMI_BOLD,
                                    fontSize: 12,
                                }}
                            >
                                {summary.plannedDayResult.title ??
                                    getDatePretty(
                                        summary.plannedDayResult.plannedDay?.date ?? new Date()
                                    ) + ' Results'}
                            </Text>
                            <View style={{ height: 6 }} />
                            <CompletedHabits completedHabits={summary.completedHabits} limit={3} />
                        </View>
                    </View>
                    <View
                        style={{
                            paddingRight: 12,
                            justifyContent: 'center',
                        }}
                    >
                        <Ionicons name={'chevron-forward'} size={14} color={colors.text} />
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

            <View style={{ width: '100%', paddingTop: 12 }}>
                {elements.length > 0 && (
                    <View>
                        <View style={{}}>{elements}</View>
                        <View style={{ width: '100%', paddingLeft: 12 }}>
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
