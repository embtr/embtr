import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_SEMI_BOLD, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onPress: () => void;
    advancedVisible: boolean;
    month: string;
}

export const CurrentMonthText = ({ onPress, advancedVisible, month}: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                Habits for{' '}
            </Text>
            <TouchableOpacity onPress={onPress}>
                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={{
                            color: colors.accent_color,
                            fontFamily: POPPINS_SEMI_BOLD,
                            fontSize: 15,
                        }}
                    >
                        {month}
                    </Text>
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingLeft: TIMELINE_CARD_PADDING / 4,
                        }}
                    >
                        <Ionicons
                            name={advancedVisible ? 'chevron-up' : 'chevron-down'}
                            size={16}
                            color={colors.text}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
