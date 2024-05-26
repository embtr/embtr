import { Text, View } from 'react-native';
import { PADDING_SMALL, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';

export const PremiumFeatureBadge = () => {
    const colors = useTheme().colors;

    return (
        <View
            style={{
                backgroundColor: colors.accent_color_light,
                borderRadius: 50,
                height: 13,
                paddingHorizontal: PADDING_SMALL,
            }}
        >
            <Text
                style={{
                    fontFamily: POPPINS_SEMI_BOLD,
                    fontSize: 9,
                    color: colors.text,
                    textAlign: 'center',
                }}
            >
                Premium
            </Text>
        </View>
    );
};
