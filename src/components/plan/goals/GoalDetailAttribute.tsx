import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    attribute: string;
    value: string;
    isFake?: boolean;
}

export const GoalDetailAttribute = ({ attribute, value, isFake }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ flex: 1, flexDirection: 'row', paddingLeft: 10 }}>
            <Ionicons name={'time-outline'} size={24} color={colors.goal_secondary_font} style={{ opacity: 0.8 }} />
            <View>
                <Text style={{ paddingLeft: 5, color: isFake ? colors.tab_selected : colors.goal_primary_font, opacity: 0.75, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                    {attribute}
                </Text>
                <Text style={{ paddingLeft: 5, color: colors.goal_primary_font, fontFamily: 'Poppins_400Regular', fontSize: 11 }}>{value}</Text>
            </View>
        </View>
    );
};
