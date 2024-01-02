import { HabitSummary } from 'resources/types/habit/Habit';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    habitSummary: HabitSummary;
}

export const HabitSummaryElement = ({ habitSummary }: Props) => {
    const colors = useTheme().colors;

    return (
        <View>
            <Text style={{ color: colors.text }}>{habitSummary.task.title}</Text>
        </View>
    );
};