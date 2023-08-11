import React from 'react';
import { View, Text, FlatList, ListRenderItemInfo } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { WidgetType } from 'resources/schema';
import { wait } from 'src/util/GeneralUtility';
import { Banner } from '../common/Banner';
import { Screen } from '../common/Screen';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { TodaysCountdownWidget } from '../widgets/TodaysCountdownWidget';
import { TodaysNotesWidget } from '../widgets/TodaysNotesWidget';
import { TodaysActivitiesWidget, WidgetSource } from '../widgets/TodaysTasksWidget';
import { DailyHistoryWidget } from '../widgets/daily_history/DailyHistoryWidget';
import { QuoteOfTheDayWidget } from '../widgets/quote_of_the_day/QuoteOfTheDayWidget';
import { ConfettiView } from '../common/animated_view/ConfettiView';
import { HabitJourneyWidget } from '../widgets/habit_journey/HabitJourneyWidget';
import { PlanningWidget } from '../widgets/PlanningWidget';
import { ActiveChallengesWidget } from '../widgets/challenges/ActiveChallengesWidget';
import { TodaysPhotosWidget } from '../widgets/TodaysPhotosWidget';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { Context, ContextOptions, DEFAULT_CONTEXT, UserUtility } from 'src/util/user/UserUtility';
import { POPPINS_MEDIUM } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

export const Today = () => {
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>();
    const [refreshing, setRefreshing] = React.useState(false);

    const { colors } = useTheme();

    const user = useAppSelector(getCurrentUser);

    const TODAY_PAGE_WIDGETS = [
        WidgetType.TIME_LEFT_IN_DAY,
        WidgetType.QUOTE_OF_THE_DAY,
        WidgetType.TODAYS_TASKS,
        //WidgetType.TODAYS_NOTES,
    ];

    React.useEffect(() => {
        setRefreshedTimestamp(new Date());
    }, []);

    const refresh = () => {
        setRefreshedTimestamp(new Date());
    };

    // may want to just directly call both to guarentee
    // upon refresh that we have all new data
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        refresh();
        wait(500).then(() => {
            setRefreshing(false);
        });
    }, []);

    if (!user) {
        return (
            <Screen>
                <View>
                    <Text>no user</Text>
                </View>
            </Screen>
        );
    }

    const [context, setContext] = React.useState<Context>(DEFAULT_CONTEXT);
    React.useEffect(() => {
        const fetch = async () => {
            const context = await UserUtility.fetch(user.id!, [ContextOptions.ACTIVE_CHALLENGES]);
            setContext(context);
        };

        fetch();
    }, []);

    const getWidgetFromType = (type: WidgetType) => {
        switch (type) {
            case WidgetType.TIME_LEFT_IN_DAY:
                return <TodaysCountdownWidget />;

            case WidgetType.TODAYS_TASKS:
                return <TodaysActivitiesWidget user={user} source={WidgetSource.TODAY} />;

            case WidgetType.TODAYS_NOTES:
                return <TodaysNotesWidget />;

            case WidgetType.QUOTE_OF_THE_DAY:
                return <QuoteOfTheDayWidget refreshedTimestamp={refreshedTimestamp!} />;

            case WidgetType.DAILY_HISTORY:
                return <DailyHistoryWidget userId={user.id!} />;

            case WidgetType.HABIT_JOURNEY:
                return <HabitJourneyWidget user={user} />;

            case WidgetType.PLANNING:
                return <PlanningWidget />;

            case WidgetType.ACTIVE_CHALLENGES:
                return <ActiveChallengesWidget challengeParticipation={context.activeChallenges} />;

            case WidgetType.TODAYS_PHOTOS:
                return <TodaysPhotosWidget />;
        }

        return <View />;
    };

    const renderItem = ({ item, index }: ListRenderItemInfo<WidgetType>) => {
        return (
            <View>
                <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                    {index === 0 && <View style={{ height: 7.5 }} />}
                    {getWidgetFromType(item)}
                </View>
            </View>
        );
    };

    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <EmbtrMenuCustom />
                <ConfettiView />

                <View style={{ height: '100%', width: '100%' }}>
                    <Banner name="Today" />
                    <FlatList
                        keyboardShouldPersistTaps={'always'}
                        data={TODAY_PAGE_WIDGETS}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.toString()}
                        renderItem={renderItem}
                        refreshControl={
                            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                        }
                    />
                </View>
            </View>
        </Screen>
    );
};
