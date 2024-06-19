import React from 'react';
import { View } from 'react-native';
import { Banner } from '../common/Banner';
import { Screen } from '../common/Screen';
import { TodaysCountdownWidget } from '../widgets/TodaysCountdownWidget';
import { QuoteOfTheDayWidget } from '../widgets/quote_of_the_day/QuoteOfTheDayWidget';
import { TodayPageLayoutContextProvider } from './TodayPageLayoutContext';
import { PADDING_LARGE } from 'src/util/constants';
import { PlanningWidgetImproved } from '../widgets/planning/PlanningWidgetImproved';
import { ScrollView } from 'react-native-gesture-handler';
import { GetPremiumWidget } from '../widgets/GetPremiumWidget';
import { AwayModeWidget } from '../widgets/AwayModeWidget';
import { OnHabitStreakWidget } from '../widgets/OnHabitStreakWidget';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { User } from 'resources/schema';

interface Props {
    user: User;
}

export const TodayImpl = ({ user }: Props) => {
    const [planningWidgetHeight, setPlanningWidgetHeight] = React.useState<number>(0);
    return (
        <TodayPageLayoutContextProvider planningWidgetHeight={planningWidgetHeight}>
            <Screen>
                <View style={{ flex: 1, paddingHorizontal: PADDING_LARGE }}>
                    <Banner name="Today" />

                    <ScrollView>
                        <AwayModeWidget user={user} />

                        <OnHabitStreakWidget user={user} />

                        <GetPremiumWidget />

                        <QuoteOfTheDayWidget />

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

export const Today = () => {
    const user = UserCustomHooks.useCurrentUser();
    if (!user.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return <TodayImpl user={user.data} />;
};
