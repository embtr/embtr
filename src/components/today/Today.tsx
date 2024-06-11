import React from 'react';
import { View, Text } from 'react-native';
import { Banner } from '../common/Banner';
import { Screen } from '../common/Screen';
import { TodaysCountdownWidget } from '../widgets/TodaysCountdownWidget';
import { QuoteOfTheDayWidget } from '../widgets/quote_of_the_day/QuoteOfTheDayWidget';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { TodayPageLayoutContextProvider } from './TodayPageLayoutContext';
import { PADDING_LARGE } from 'src/util/constants';
import { PlanningWidgetImproved } from '../widgets/planning/PlanningWidgetImproved';
import { ScrollView } from 'react-native-gesture-handler';
import { GetPremiumWidget } from '../widgets/GetPremiumWidget';
import { AwayModeWidget } from '../widgets/AwayModeWidget';

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

    return (
        <TodayPageLayoutContextProvider planningWidgetHeight={planningWidgetHeight}>
            <Screen>
                <View style={{ flex: 1, paddingHorizontal: PADDING_LARGE }}>
                    <Banner name="Today" />

                    <ScrollView>
                        <TodaysCountdownWidget />

                        <AwayModeWidget />

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
