import React from 'react';
import { View } from 'react-native';
import { Banner } from '../common/Banner';
import { Screen } from '../common/Screen';
import { TodayPageLayoutContextProvider } from './TodayPageLayoutContext';
import { PADDING_LARGE } from 'src/util/constants';
import { PlanningWidgetImproved } from '../widgets/planning/PlanningWidgetImproved';
import { ScrollView } from 'react-native-gesture-handler';
import { GetPremiumWidget } from '../widgets/GetPremiumWidget';
import { AwayModeWidget } from '../widgets/AwayModeWidget';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { User } from 'resources/schema';
import { PlanDayFooter } from '../plan/planning/PlanDayFooter';

interface Props {
    user: User;
}

export const TodayImpl = ({ user }: Props) => {
    const [planningWidgetHeight, setPlanningWidgetHeight] = React.useState<number>(0);
    return (
        <TodayPageLayoutContextProvider planningWidgetHeight={planningWidgetHeight}>
            <Screen>
                <Banner name="Today" innerRightPoints={true} />
                <View
                    style={{
                        flex: 1,
                        paddingHorizontal: PADDING_LARGE,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ScrollView>
                        <GetPremiumWidget />
                        <AwayModeWidget user={user} />

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

                        {/* Add some padding to the bottom of the screen to make room for footer */}
                        <View style={{ height: PADDING_LARGE * 6 }} />
                    </ScrollView>

                    <PlanDayFooter />
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
