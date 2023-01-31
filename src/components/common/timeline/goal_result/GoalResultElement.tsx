import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TaskCompleteSymbol } from '../../task_symbols/TaskCompleteSymbol';

interface Props {
    field: string;
    value: string;
}

export const GoalResultElement = ({ field, value }: Props) => {
    const { colors } = useTheme();

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TaskCompleteSymbol />

                <View style={{ paddingLeft: 5 }}>
                    <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}>{field}</Text>
                    <Text style={{ bottom: 2, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>{value}</Text>
                </View>
            </View>
        </View>
    );
};
