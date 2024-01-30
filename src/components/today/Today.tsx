import React from 'react';
import { View, Text } from 'react-native';
import { WidgetType } from 'resources/schema';
import { Banner } from '../common/Banner';
import { Screen } from '../common/Screen';
import { TodaysCountdownWidget } from '../widgets/TodaysCountdownWidget';
import { TodaysNotesWidget } from '../widgets/TodaysNotesWidget';
import { TodaysActivitiesWidget, WidgetSource } from '../widgets/TodaysTasksWidget';
import { DailyHistoryWidget } from '../widgets/daily_history/DailyHistoryWidget';
import { QuoteOfTheDayWidget } from '../widgets/quote_of_the_day/QuoteOfTheDayWidget';
import { HabitJourneyWidget } from '../widgets/habit_journey/HabitJourneyWidget';
import { ActiveChallengesWidget } from '../widgets/challenges/ActiveChallengesWidget';
import { TodaysPhotosWidget } from '../widgets/TodaysPhotosWidget';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { Context, ContextOptions, DEFAULT_CONTEXT, UserUtility } from 'src/util/user/UserUtility';
import { TodayPageLayoutContextProvider } from './TodayPageLayoutContext';
import { PADDING_LARGE } from 'src/util/constants';
import { PlanningWidgetImproved } from '../widgets/planning/PlanningWidgetImproved';
import { TodaysTasksWidgetImproved } from '../widgets/planning/TodaysTasksWidgetImproved';
import { ScrollView } from 'react-native-gesture-handler';

export const Today = () => {
    const [planningWidgetHeight, setPlanningWidgetHeight] = React.useState<number>(0);

    const user = useAppSelector(getCurrentUser);

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
                return <QuoteOfTheDayWidget />;

            case WidgetType.DAILY_HISTORY:
                return <DailyHistoryWidget userId={user.id!} />;

            case WidgetType.HABIT_JOURNEY:
                return <HabitJourneyWidget user={user} />;

            case WidgetType.PLANNING:
                return <PlanningWidgetImproved />;

            case WidgetType.ACTIVE_CHALLENGES:
                return <ActiveChallengesWidget challengeParticipation={context.activeChallenges} />;

            case WidgetType.TODAYS_PHOTOS:
                return <TodaysPhotosWidget />;
        }

        return <View />;
    };

    return (
        <TodayPageLayoutContextProvider planningWidgetHeight={planningWidgetHeight}>
            <Screen>
                <View style={{ flex: 1, paddingHorizontal: PADDING_LARGE }}>
                    <Banner name="Today" />

                    <ScrollView>
                        <TodaysCountdownWidget />
                        <View style={{ height: PADDING_LARGE }} />
                        <QuoteOfTheDayWidget />
                        <View style={{ height: PADDING_LARGE }} />

                        <View
                            onLayout={(e) => {
                                if (planningWidgetHeight === 0) {
                                    setPlanningWidgetHeight(e.nativeEvent.layout.height);
                                }
                            }}
                            style={{ flex: 1 }}
                        >
                            <TodaysTasksWidgetImproved />
                        </View>

                        <View style={{ height: PADDING_LARGE * 1.5 }} />
                    </ScrollView>
                </View>
            </Screen>
        </TodayPageLayoutContextProvider>
    );
};
