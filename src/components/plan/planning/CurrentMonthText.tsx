import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_SEMI_BOLD, PADDING_LARGE } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onPress: () => void;
    advancedVisible: boolean;
    month: string;
    scrollToToday: () => void;
}

export const CurrentMonthText = ({ onPress, advancedVisible, month, scrollToToday }: Props) => {
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
                            paddingLeft: PADDING_LARGE / 4,
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
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        scrollToToday();
                    }}
                    style={[
                        {
                            flexDirection: 'row',
                            backgroundColor: colors.background_light,
                            borderRadius: 5,
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <Ionicons name={'sunny-outline'} size={16} color={colors.text} />
                </TouchableOpacity>
            </View>
        </View>
    );
};
