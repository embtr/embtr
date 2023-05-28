import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from '../WidgetBase';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { HabitJourneys } from 'resources/types/habit/Habit';
import React from 'react';
import { User } from 'resources/schema';
import { HabitController } from 'src/controller/habit/HabitController';
import { HabitJourneyElement2 } from './HabitJourneyElement2';

interface Props {
    user: User;
    refreshedTimestamp: Date;
}

export const HabitJourneyWidget = ({ user, refreshedTimestamp }: Props) => {
    const { colors } = useTheme();

    const [habitJourneys, setHabitJourneys] = React.useState<HabitJourneys>();

    const fetch = async () => {
        if (!user.id) {
            return;
        }

        const results = await HabitController.getHabitJourneys(user.id);
        if (!results) {
            return;
        }
        setHabitJourneys(results);
    };

    React.useEffect(() => {
        fetch();
    }, [refreshedTimestamp]);

    const elements: JSX.Element[] = [];
    if (habitJourneys?.elements) {
        for (const habitJourney of habitJourneys.elements) {
            elements.push(
                <View key={habitJourney.habit.title} style={{ paddingTop: 20, paddingBottom: 5 }}>
                    <HabitJourneyElement2 habitJourney={habitJourney} />
                </View>
            );
        }
    }

    return (
        <WidgetBase>
            <View>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    Habit Journey
                </Text>

                <View>
                    <View>{elements}</View>
                </View>
            </View>
        </WidgetBase>
    );
};
