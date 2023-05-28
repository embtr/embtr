import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { IoniconName, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';

interface Props {
    name: string;
    icon: IoniconName;
    progress: number;
    tier: number;
}

export const HabitJourneyElement = ({ name, icon, progress, tier }: Props) => {
    const { colors } = useTheme();

    return (
        <View>
            <View
                style={{
                    alignItems: 'center',
                }}
            >
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD }}>{name}</Text>
                <Ionicons name={icon} size={60} color={colors.text} />
            </View>

            <View style={{ alignItems: 'center' }}>
                <Text
                    style={{
                        color: colors.tab_selected,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 12,
                    }}
                >
                    tier {tier}
                </Text>
                <ProgressBar progress={progress} />
            </View>
        </View>
    );
};
