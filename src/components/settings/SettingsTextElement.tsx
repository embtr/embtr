import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_MEDIUM, SETTINGS_MENU_ITEM_WIDTH } from 'src/util/constants';

interface Props {
    text: string;
    secondaryText: string;
    thirdaryText: string;
}

export const SettingsTextElement = ({ text, secondaryText, thirdaryText }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: colors.button_background,
                    width: SETTINGS_MENU_ITEM_WIDTH,
                    height: 75,
                    borderRadius: 15,
                    flexDirection: 'row',
                },
                CARD_SHADOW,
            ]}
        >
            {/* KEY */}
            <View style={{ justifyContent: 'center' }}>
                <Text
                    style={{
                        color: colors.button_text,
                        fontFamily: 'Poppins_500Medium',
                        fontSize: 15,
                        alignItems: 'flex-start',
                        paddingLeft: 30,
                    }}
                >
                    {text}
                </Text>
            </View>

            {/* VALUE */}
            <View
                style={{
                    flex: 1,
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingRight: 30,
                }}
            >
                <Text
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={{
                        color: colors.secondary_text,
                        fontFamily: POPPINS_MEDIUM,
                        fontSize: 15,
                        paddingLeft: 30,
                        width: '100%',
                        textAlign: 'right',
                    }}
                >
                    {thirdaryText && (
                        <Text
                            style={{
                                color: 'red',
                                fontFamily: 'Poppins_500Medium',
                                fontSize: 15,
                                alignItems: 'flex-start',
                                paddingLeft: 30,
                                flex: 2,
                            }}
                        >
                            {thirdaryText}
                            {'  '}
                        </Text>
                    )}

                    {secondaryText}
                </Text>
            </View>
        </View>
    );
};
