import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { HabitSummaryCustomHooks } from 'src/controller/habit/HabitSummaryController';
import { HabitSummaries } from 'src/components/manage_habits/HabitSummaries';
import { View } from 'react-native';
import { Checkbox } from 'src/components/checkbox/Checkbox';
import React from 'react';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';

export const ManageHabits = () => {
    const navigation = useEmbtrNavigation();
    const habitSummaries = HabitSummaryCustomHooks.useHabitSummaries();
    const [showExpired, setShowExpired] = React.useState<boolean>(false);

    return (
        <Screen>
            <Banner
                name={'Manage Habits'}
                leftText={'close'}
                leftOnClick={() => {
                    navigation.goBack();
                }}
            />

            <View
                style={{
                    paddingHorizontal: TIMELINE_CARD_PADDING,
                    width: '100%',
                    flexDirection: 'row',
                }}
            >
                <View style={{ flex: 1 }} />
                <Checkbox
                    text={'Show Expired '}
                    checked={showExpired}
                    onCheck={() => {
                        setShowExpired(!showExpired);
                    }}
                />
            </View>

            <HabitSummaries habitSummaries={habitSummaries.data ?? []} showExpired={showExpired} />
        </Screen>
    );
};
