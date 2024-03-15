import React from 'react';
import { View, Text } from 'react-native';
import { WidgetType } from 'resources/schema';
import { Banner } from '../common/Banner';
import { Screen } from '../common/Screen';
import { TodaysCountdownWidget } from '../widgets/TodaysCountdownWidget';
import { TodaysNotesWidget } from '../widgets/TodaysNotesWidget';
import { TodaysActivitiesWidget, WidgetSource } from '../widgets/TodaysTasksWidget';
import { QuoteOfTheDayWidget } from '../widgets/quote_of_the_day/QuoteOfTheDayWidget';
import { HabitJourneyWidget } from '../widgets/habit_journey/HabitJourneyWidget';
import { ActiveChallengesWidget } from '../widgets/challenges/ActiveChallengesWidget';
import { TodaysPhotosWidget } from '../widgets/TodaysPhotosWidget';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { TodayPageLayoutContextProvider } from './TodayPageLayoutContext';
import { PADDING_LARGE } from 'src/util/constants';
import { PlanningWidgetImproved } from '../widgets/planning/PlanningWidgetImproved';
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

            case WidgetType.HABIT_JOURNEY:
                return <HabitJourneyWidget user={user} />;

            case WidgetType.PLANNING:
                return <PlanningWidgetImproved />;

            //case WidgetType.ACTIVE_CHALLENGES:
            //    return <ActiveChallengesWidget challengeParticipation={context.activeChallenges} />;

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
                            <PlanningWidgetImproved />
                        </View>

                        <View style={{ height: PADDING_LARGE * 1.5 }} />
                    </ScrollView>
                </View>
            </Screen>
        </TodayPageLayoutContextProvider>
    );
};
