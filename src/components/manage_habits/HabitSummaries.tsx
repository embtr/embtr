import { View, Text } from 'react-native';
import { HabitSummary } from 'resources/types/habit/Habit';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { HabitSummaryElement } from 'src/components/manage_habits/HabitSummaryElement';

interface Props {
    habitSummaries: HabitSummary[];
    hideInactive: boolean;
}

export const HabitSummaries = ({ habitSummaries, hideInactive }: Props) => {
    const colors = useTheme().colors;

    const habits = hideInactive
        ? habitSummaries.filter((habitSummary) => {
              return habitSummary.nextHabitDays && habitSummary.nextHabitDays > 0;
          })
        : habitSummaries;

    return (
        <View>
            {habits.map((habitSummary) => {
                return <HabitSummaryElement habitSummary={habitSummary} />;
            })}
        </View>
    );
};
