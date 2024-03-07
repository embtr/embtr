import React from 'react';
import { View } from 'react-native';
import { FlatList, RefreshControl } from 'react-native-gesture-handler';
import { WidgetType } from 'resources/schema';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { wait } from 'src/util/GeneralUtility';
import { Screen } from '../common/Screen';
import { EmbtrMenuCustom } from '../common/menu/EmbtrMenuCustom';
import { EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { DailyHistoryWidget } from '../widgets/daily_history/DailyHistoryWidget';
import { ConfettiView } from '../common/animated_view/ConfettiView';
import { Banner } from '../common/Banner';

export const Journey = () => {
    const [refreshedTimestamp, setRefreshedTimestamp] = React.useState<Date>();
    const [refreshing, setRefreshing] = React.useState(false);
    const [isConfiguringWidgets, setIsConfiguringWidgets] = React.useState<boolean>(false);
    const currentUser = UserCustomHooks.useCurrentUser();

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

    if (!currentUser.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const getWidgetFromType = (type: WidgetType) => {
        switch (type) {
            case WidgetType.DAILY_HISTORY:
                return <DailyHistoryWidget userId={currentUser.data?.id ?? 0} />;
            //case WidgetType.TIME_LEFT_IN_DAY:
            //    return <TodaysCountdownWidget />;

            //case WidgetType.TODAYS_NOTES:
            //    return <TodaysNotesWidget />;

            //case WidgetType.HABIT_JOURNEY:
            //    return <HabitJourneyWidget user={currentUser.data!} />;

            //case WidgetType.PLANNING:
            //    return <PlanningWidgetImproved />;

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
                <Banner name="My Journey" />
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
