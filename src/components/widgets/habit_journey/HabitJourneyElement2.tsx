import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';

import { HabitJourney } from 'resources/types/habit/Habit';
import { HabitIcon } from 'src/components/plan/habit/HabitIcon';

interface Props {
    habitJourney: HabitJourney;
}

export const HabitJourneyElement2 = ({ habitJourney }: Props) => {
    const { colors } = useTheme();

    let level = 0;
    habitJourney.elements.forEach((element) => {
        if (element.daysInSeason > 3) {
            level++;
        }
    });

    const progress = level * (100 / 5);

    const elements: JSX.Element[] = [];
    for (let i = 1; i <= 5; i++) {
        elements.push(
            <View
                key={'habit_element_' + i}
                style={{
                    flex: 1,
                    alignContent: 'center',
                    justifyContent: 'center',
                }}
            >
                <HabitIcon
                    habit={habitJourney.habit}
                    size={20}
                    color={i - 1 <= level ? colors.tab_selected : colors.text}
                />
            </View>
        );
    }
    elements.push(
        <View
            key={'habit_element_' + 6}
            style={{
                alignContent: 'center',
                justifyContent: 'center',
            }}
        >
            <HabitIcon habit={habitJourney.habit} size={20} color={colors.text} />
        </View>
    );

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    {habitJourney.habit.title}
                </Text>
                <Text
                    style={{
                        paddingLeft: 5,
                        color: colors.tab_selected,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 12,
                    }}
                >
                    {'level ' + level}
                </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>{elements}</View>

            <View style={{ paddingTop: 5 }}>
                <ProgressBar progress={progress || 2} />
            </View>
        </View>
    );
};
