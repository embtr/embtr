import { View, Text } from 'react-native';
import { HabitSummary } from 'resources/types/habit/Habit';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { HabitSummaryElement } from 'src/components/manage_habits/HabitSummaryElement';

interface Props {
    habitSummaries: HabitSummary[];
}

export const HabitSummaries = ({ habitSummaries }: Props) => {
    const colors = useTheme().colors;

    return (
        <View>
            {habitSummaries.map((habitSummary) => {
                return <HabitSummaryElement habitSummary={habitSummary} />;
            })}
        </View>
    );
};
