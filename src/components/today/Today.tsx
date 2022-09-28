import { getAuth } from 'firebase/auth';
import React from 'react';
import { RefreshControl, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Banner } from '../common/Banner';
import { Screen } from '../common/Screen';
import { QuoteOfTheDayWidget } from '../widgets/QuoteOfTheDayWidget';
import { TodaysPhotosWidget } from '../widgets/TodaysPhotosWidget';
import { TodaysTasksWidget } from '../widgets/TodaysTasksWidget';

export const Today = () => {
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(500).then(() => setRefreshing(false));
    }, []);

    const wait = (timeout: number | undefined) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    };

    return (
        <Screen>
            <View style={{ height: '100%', width: '100%' }}>
                <Banner name="Today" />
                <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    {/* QUOTE OF THE DAY WIDGET */}
                    <QuoteOfTheDayWidget />

                    {/* TODAY'S TASKS WIDGET */}
                    <TodaysTasksWidget />

                    {/* TODAY'S PHOTOS WIDGET */}
                    <TodaysPhotosWidget />
                </ScrollView>
            </View>
        </Screen>
    );
};
