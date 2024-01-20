import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from 'src/components/widgets/WidgetBase';
import { POPPINS_SEMI_BOLD, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentTab } from 'src/redux/user/GlobalState';
import { getNavigationHook } from 'src/util/navigation/NavigationHookProvider';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { PlannedDayResultSummary } from 'resources/types/planned_day_result/PlannedDayResult';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { PostWidgetElement } from 'src/components/widgets/post_widget_commons/PostWidgetElement';

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

        const completedHabits = summary.completedHabits.length;
        const body = `${completedHabits} habit${completedHabits === 1 ? '' : 's'} completed`;

        const element = (
            <TouchableOpacity
                key={i}
                onPress={() => {
                    navigation.navigate('DailyResultDetails', {
                        id: summary.plannedDayResult.id ?? 0,
                    });
                }}
            >
                <PostWidgetElement
                    title={summary.plannedDayResult.title ?? ''}
                    body={body}
                    commentCount={summary.plannedDayResult.comments?.length ?? 0}
                    likeCount={summary.plannedDayResult.likes?.length ?? 0}
                    date={summary.plannedDayResult.plannedDay?.date ?? new Date()}
                    imageData={imageData}
                    imagePadSize={10}
                />
            </TouchableOpacity>
        );

        elements.push(<View style={{ height: TIMELINE_CARD_PADDING / 2 }} />);
        elements.push(element);
    }

    return (
        <WidgetBase>
            <Text
                style={{
                    color: colors.text,
                    fontFamily: POPPINS_SEMI_BOLD,
                    fontSize: 15,
                    lineHeight: 17,
                }}
            >
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
                            view all...
                        </Text>
                    </View>
                </View>
            ) : (
                <Text style={{ color: colors.secondary_text }}>no recent daily results...</Text>
            )}
        </WidgetBase>
    );
};
