import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { CARD_SHADOW, POPPINS_SEMI_BOLD, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentTab } from 'src/redux/user/GlobalState';
import { getNavigationHook } from 'src/util/navigation/NavigationHookProvider';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { NestedImages } from 'src/components/common/images/NestedImages';

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
        const imageData: OptimalImageData[] = [];
        summary.completedHabits.forEach((completedHabit) => {
            imageData.push({
                localImage: completedHabit.localImage,
                remoteImageUrl: completedHabit.remoteImageUrl,
            });
        });

        const element = (
            <Pressable
                onPress={() => {
                    navigation.navigate('DailyResultDetails', {
                        id: summary.plannedDayResult.id ?? 0,
                    });
                }}
            >
                <View
                    style={[
                        {
                            flexDirection: 'row',
                            backgroundColor: '#404040',
                            borderRadius: 5,
                            padding: TIMELINE_CARD_PADDING / 2,
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <NestedImages imageData={imageData} size={60} padSize={15} paddingStep={5} />
                </View>
            </Pressable>
        );

        elements.push(<View style={{ height: TIMELINE_CARD_PADDING }} />);
        elements.push(element);
    }

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                Daily Results
            </Text>

            {elements.length > 0 ? (
                <View>
                    {elements}
                    <View style={{ width: '100%', paddingTop: TIMELINE_CARD_PADDING }}>
                        <Text
                            onPress={() => {
                                //@ts-ignore
                                navigation.navigate('DailyResults', { userId: userId });
                            }}
                            style={{ color: colors.link, fontSize: 12 }}
                        >
                            view all..
                        </Text>
                    </View>
                </View>
            ) : (
                <Text style={{ color: colors.secondary_text, paddingLeft: 5 }}>
                    no recent daily results...
                </Text>
            )}
        </WidgetBase>
    );
};
