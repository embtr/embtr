import { Text, View } from 'react-native';
import { PADDING_SMALL, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
    tiny?: boolean;
}

export const PremiumFeatureBadge = ({ tiny }: Props) => {
    const colors = useTheme().colors;

    return (
        <View
            style={{
                backgroundColor: colors.accent_color_light,
                borderRadius: 50,
                height: tiny ? 10 : 13,
                paddingHorizontal: PADDING_SMALL,
            }}
        >
            <Text
                style={{
                    fontFamily: POPPINS_SEMI_BOLD,
                    fontSize: tiny ? 7 : 9,
                    color: colors.text,
                    textAlign: 'center',
                }}
            >
                Premium
            </Text>
        </View>
    );
};
