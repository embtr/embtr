import React from 'react';
import { View, FlatList, ListRenderItemInfo } from 'react-native';
import { GestureHandlerRootView, RefreshControl } from 'react-native-gesture-handler';
import { User, Widget, WidgetType } from 'resources/schema';
import UserController from 'src/controller/user/UserController';
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

export const Today = () => {
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>();
    const [refreshing, setRefreshing] = React.useState(false);
    const [user, setUser] = React.useState<User>();

    const TODAY_PAGE_WIDGETS = [
        WidgetType.TIME_LEFT_IN_DAY,
        WidgetType.QUOTE_OF_THE_DAY,
        WidgetType.PLANNING,
        WidgetType.TODAYS_PHOTOS,
        WidgetType.TODAYS_NOTES,
    ];

    React.useEffect(() => {
        setRefreshedTimestamp(new Date());
    }, []);

    const fetchNewCurrentUser = async () => {
        const newCurrentUser = await UserController.getCurrentUser();
        if (!newCurrentUser.user) {
            return;
        }

        setUser(newCurrentUser.user);
    };

    React.useEffect(() => {
        fetchNewCurrentUser();
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
                <View />
            </Screen>
        );
    }

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
                return <ActiveChallengesWidget user={user} />;

            case WidgetType.TODAYS_PHOTOS:
                return <TodaysPhotosWidget />;

                return <View />;
        }

        return <View />;
    };

    const renderItem = ({ item, index }: ListRenderItemInfo<WidgetType>) => {
        return (
            <View>
                <View style={{ paddingTop: 7.5 }}>
                    {getWidgetFromType(item)}
                    {index === TODAY_PAGE_WIDGETS.length - 1 && <View style={{ height: 7.5 }} />}
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
