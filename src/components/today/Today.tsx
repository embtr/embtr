import { getAuth } from 'firebase/auth';
import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Banner } from '../common/Banner';
import { Screen } from '../common/Screen';
import { QuoteOfTheDayWidget } from '../widgets/QuoteOfTheDayWidget';
import { TodaysPhotosWidget } from '../widgets/TodaysPhotosWidget';
import { TodaysTasksWidget } from '../widgets/TodaysTasksWidget';

export const Today = () => {
    return (
        <Screen>
            <View style={{ height: '100%', width: '100%' }}>
                <Banner name="Today" />
                <ScrollView>
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
