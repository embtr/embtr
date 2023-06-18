import { View } from 'react-native';
import { DailyHistoryWidget } from 'src/components/widgets/daily_history/DailyHistoryWidget';
import { User } from 'resources/schema';
import { TodaysActivitiesWidget, WidgetSource } from 'src/components/widgets/TodaysTasksWidget';
import { HabitJourneyWidget } from 'src/components/widgets/habit_journey/HabitJourneyWidget';
import { getRandomInt } from 'src/util/GeneralUtility';
import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { getBorderColorAsync } from 'expo-navigation-bar';

interface Props {
    newUser: User;
    setHeight: Function;
}

export const ProfileTabRoute = ({ newUser, setHeight }: Props) => {
    const [height, setHeightState] = React.useState(0);

    return (
        <View
            style={{ paddingBottom: 5 }}
            onLayout={(e) => {
                setHeight(e.nativeEvent.layout.height);
            }}
        >
            <View style={{backgroundColor: "green", width: "100%", height: 400, borderWidth: 3, borderColor: "red"}} />
            {/*
            <View style={{ paddingTop: 5 }}>
                {newUser.id && (
                    <View style={{ width: '100%' }}>
                        {<DailyHistoryWidget userId={newUser.id} />}
                    </View>
                )}
            </View>
            <View style={{ paddingTop: 6 }}>
                <TodaysActivitiesWidget user={newUser} source={WidgetSource.PROFILE} />
            </View>
            <View style={{ paddingTop: 6 }}>
                <HabitJourneyWidget user={newUser} />
            </View>
                */}
        </View>
    );
};
