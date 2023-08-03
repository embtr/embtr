import { View, Text } from 'react-native';
import { CompletedHabit } from 'resources/types/planned_day_result/PlannedDayResult';
import { HabitIcon } from 'src/components/plan/habit/HabitIcon';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    completedHabit: CompletedHabit;
    color?: string;
}

export const CompletedHabitElement = ({ completedHabit, color }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ alignItems: 'center' }}>
            <HabitIcon
                habit={completedHabit.habit}
                size={30}
                color={color ?? colors.tab_selected}
            />

            <Text
                style={{
                    fontFamily: POPPINS_REGULAR,
                    fontSize: 14,
                    textAlign: 'center',
                    color: colors.text,
                    top: 3,
                }}
            >
                {completedHabit.habit.title}
            </Text>
            <Text
                style={{
                    fontFamily: POPPINS_REGULAR,
                    fontSize: 12,
                    textAlign: 'center',
                    includeFontPadding: false,
                    color: colors.text,
                }}
            >
                {completedHabit.completed} / {completedHabit.attempted}
            </Text>
        </View>
    );
};
