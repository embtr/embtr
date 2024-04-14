import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';

export const ChallengeLabel = () => {
    const colors = useTheme().colors;

    return (
        <View
            style={{
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 50,
                backgroundColor: colors.secondary_accent_color,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Ionicons name={'flash'} size={10} color={colors.text} />
            <Text
                style={{
                    includeFontPadding: false,
                    fontFamily: POPPINS_SEMI_BOLD,
                    fontSize: 9,
                    paddingLeft: 2,
                    color: colors.text,
                }}
            >
                Challenge
            </Text>
        </View>
    );
};
