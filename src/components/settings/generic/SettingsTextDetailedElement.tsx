import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';

interface Props {
    firstaryText: string;
    secondaryText?: string;
}

export const SettingsTextDetailedElement = ({ firstaryText, secondaryText }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: colors.accent_color_faint,
                    height: 75,
                    width: '100%',
                    borderRadius: 3,
                    flexDirection: 'row',
                },
                CARD_SHADOW,
            ]}
        >
            <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View
                        style={{
                            flex: 1,
                            paddingLeft: PADDING_LARGE * 2,
                            justifyContent: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: colors.button_text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 15,
                                alignItems: 'flex-start',
                            }}
                        >
                            {firstaryText}
                        </Text>

                        {secondaryText && (
                            <Text
                                style={{
                                    color: colors.secondary_text,
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 12,
                                    top: 2,
                                }}
                            >
                                {secondaryText}
                            </Text>
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};
