import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { WidgetBase } from '../WidgetBase';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { HabitJourneys } from 'resources/types/habit/Habit';
import React from 'react';
import { User } from 'resources/schema';
import { HabitController } from 'src/controller/habit/HabitController';
import { HabitJourneyElement2 } from './HabitJourneyElement2';
import { HabitJourneyElement3 } from './HabitJourneyElement3';
import { HabitIcon } from 'src/components/plan/habit/HabitIcon';

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

    const [selectedView, setSelectedView] = React.useState(0);

    const handleViewPress = (index: number) => {
        setSelectedView(index);
    };

    const habitLabelElements: JSX.Element[] = [];
    if (habitJourneys?.elements) {
        for (const habitJourney of habitJourneys.elements) {
            habitLabelElements.push(
                <View style={{ paddingLeft: 5 }}>
                    <TouchableOpacity
                        key={habitJourney.habit.title}
                        onPress={() => handleViewPress(habitJourney.habit.id!)}
                        style={{
                            padding: 10,
                            borderRadius: 10,
                            borderWidth: 2,
                            backgroundColor: colors.background,

                            borderColor:
                                selectedView === habitJourney.habit.id
                                    ? colors.tab_selected
                                    : colors.background,
                            flexDirection: 'row',
                        }}
                    >
                        <View style={{ top: 1 }}>
                            <HabitIcon
                                habit={habitJourney.habit}
                                size={15}
                                color={colors.tab_selected}
                            />
                        </View>
                        <Text
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 12,
                                paddingLeft: 5,
                            }}
                        >
                            {habitJourney.habit.title}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    let element: JSX.Element = <View></View>;

    if (habitJourneys?.elements) {
        for (const habitJourney of habitJourneys.elements) {
            if (habitJourney.habit.id === selectedView) {
                element = (
                    <View
                        key={habitJourney.habit.title}
                        style={{ paddingTop: 20, paddingBottom: 5 }}
                    >
                        <HabitJourneyElement3 habitJourney={habitJourney} />
                    </View>
                );

                break;
            }
        }
    }

    return (
        <WidgetBase>
            <View>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    Habit Journey
                </Text>

                <Text
                    style={{
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 12,
                    }}
                >
                    Level up your habits with consistency!
                </Text>

                <View style={{ paddingTop: 15 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {habitLabelElements}
                    </ScrollView>
                </View>

                <View style={{ overflow: 'hidden' }}>{element}</View>
            </View>
        </WidgetBase>
    );
};
