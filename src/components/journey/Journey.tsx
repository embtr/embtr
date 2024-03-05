import React from 'react';
import { View } from 'react-native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { User, WidgetType } from 'resources/schema';
import UserController from 'src/controller/user/UserController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { wait } from 'src/util/GeneralUtility';
import { Screen } from '../common/Screen';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { TodaysCountdownWidget } from '../widgets/TodaysCountdownWidget';
import { TodaysNotesWidget } from '../widgets/TodaysNotesWidget';
import { TodaysActivitiesWidget, WidgetSource } from '../widgets/TodaysTasksWidget';
import { DailyHistoryWidget } from '../widgets/daily_history/DailyHistoryWidget';
import { QuoteOfTheDayWidget } from '../widgets/quote_of_the_day/QuoteOfTheDayWidget';
import { ConfettiView } from '../common/animated_view/ConfettiView';
import { HabitJourneyWidget } from '../widgets/habit_journey/HabitJourneyWidget';
import { ActiveChallengesWidget } from '../widgets/challenges/ActiveChallengesWidget';
import { Context, ContextOptions, DEFAULT_CONTEXT, UserUtility } from 'src/util/user/UserUtility';
import { PlanningWidgetImproved } from '../widgets/planning/PlanningWidgetImproved';

export const Journey = () => {
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>();
    const [refreshing, setRefreshing] = React.useState(false);
    const [isConfiguringWidgets, setIsConfiguringWidgets] = React.useState<boolean>(false);
    const [user, setUser] = React.useState<User>();

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

    const closeMenu = useAppSelector(getCloseMenu);
    const menuOptions: EmbtrMenuOption[] = [
        {
            name: 'Widget Marketplace',
            onPress: () => {
                closeMenu();
            },
        },
        {
            name: 'Configure',
            onPress: () => {
                closeMenu();
            },
        },
    ];

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
                return <PlanningWidgetImproved />;

            //case WidgetType.ACTIVE_CHALLENGES:
            //    return <ActiveChallengesWidget challengeParticipation={context.activeChallenges} />;
        }

        return <View />;
    };

    const renderItem = (item: WidgetType, index: number) => {
        return (
            <View style={{ paddingHorizontal: 12, paddingBottom: 12 }}>
                {index === 0 && <View style={{ height: 7.5 }} />}
                {getWidgetFromType(item)}
            </View>
        );
    };

    const widgets: WidgetType[] = [
        WidgetType.HABIT_JOURNEY,
        WidgetType.DAILY_HISTORY,
        WidgetType.ACTIVE_CHALLENGES,
    ];

    return (
        <Screen>
            <View style={{ flex: 1 }}>
                <EmbtrMenuCustom />
                <ConfettiView />

                <View style={{ height: '100%', width: '100%' }}>
                    <FlatList
                        keyboardShouldPersistTaps={'always'}
                        data={widgets}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item}
                        renderItem={({ item, index }) => renderItem(item, index)}
                        // Add this prop to handle refresh
                        refreshControl={
                            <RefreshControl
                                enabled={!isConfiguringWidgets}
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    />
                </View>
            </View>
        </Screen>
    );
};
