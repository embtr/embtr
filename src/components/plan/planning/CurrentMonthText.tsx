import { TouchableOpacity, View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    CARD_SHADOW,
    POPPINS_SEMI_BOLD,
    PADDING_LARGE,
    POPPINS_REGULAR,
    PADDING_SMALL,
} from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    onPress: () => void;
    advancedVisible: boolean;
    month: string;
    scrollToToday: () => void;
    navigateToCreateHabit: () => void;
}

export const CurrentMonthText = ({
    onPress,
    advancedVisible,
    month,
    scrollToToday,
    navigateToCreateHabit,
}: Props) => {
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
                            color: colors.accent_color_light,
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
                    justifyContent: 'flex-end',
                    paddingLeft: PADDING_LARGE,
                    alignItems: 'center',
                    flexDirection: 'row',
                    flex: 1,
                }}
            >
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            scrollToToday();
                        }}
                        style={[
                            {
                                flexDirection: 'row',
                                backgroundColor: '#404040',
                                borderRadius: 5,
                                paddingHorizontal: 4,
                                paddingVertical: 2,
                            },
                            CARD_SHADOW,
                        ]}
                    >
                        <Text
                            style={{
                                color: colors.text,
                                fontSize: 12,
                                fontFamily: POPPINS_REGULAR,
                                paddingHorizontal: PADDING_SMALL / 2,
                            }}
                        >
                            Today
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
