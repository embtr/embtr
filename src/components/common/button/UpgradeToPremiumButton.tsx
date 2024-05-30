import { Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { CARD_SHADOW, PADDING_SMALL, POPPINS_MEDIUM } from 'src/util/constants';
import { PremiumBadge } from '../PremiumBadge';

interface Props {
    source: string;
}

export const UpgradeToPremiumButton = ({ source }: Props) => {
    const { colors } = useTheme();

    const purchasePremiumWorkflow = UserCustomHooks.usePurchasePremium();

    return (
        <TouchableOpacity
            onPress={async () => {
                purchasePremiumWorkflow(source);
            }}
            style={[
                {
                    width: '65%',
                    flexDirection: 'row',
                    backgroundColor: colors.accent_color_light,
                    borderRadius: 5,
                    paddingHorizontal: 4,
                    paddingVertical: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                CARD_SHADOW,
            ]}
        >
            <View style={{ paddingRight: PADDING_SMALL / 2 }}>
                <PremiumBadge size={18} white={true} />
            </View>
            <Text
                style={{
                    color: colors.text,
                    fontSize: 12,
                    fontFamily: POPPINS_MEDIUM,
                    textAlign: 'center',
                    includeFontPadding: false,
                }}
            >
                Unlock Premium Stats
            </Text>
        </TouchableOpacity>
    );
};
