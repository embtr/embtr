import { Pressable, Text, TextStyle, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_MEDIUM, PADDING_LARGE } from 'src/util/constants';

interface Props {
    text: string;
    secondaryText: string;
    thirdaryText: string;
    secondaryTextStyle?: TextStyle;
    onPress?: Function;
}

export const SettingsTextElement = ({
    text,
    secondaryText,
    thirdaryText,
    secondaryTextStyle,
    onPress,
}: Props) => {
    const { colors } = useTheme();

    return (
        <Pressable
            onPress={() => {
                if (onPress) {
                    onPress();
                }
            }}
        >
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
                {/* KEY */}
                <View style={{ justifyContent: 'center' }}>
                    <Text
                        style={{
                            color: colors.button_text,
                            fontFamily: POPPINS_MEDIUM,
                            fontSize: 15,
                            alignItems: 'flex-start',
                            paddingLeft: PADDING_LARGE * 2,
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
                        style={[
                            {
                                color: colors.secondary_text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 15,
                                paddingLeft: 30,
                                width: '100%',
                                textAlign: 'right',
                            },
                            secondaryTextStyle,
                        ]}
                    >
                        {thirdaryText && (
                            <Text
                                style={{
                                    color: colors.accent_color_light,
                                    fontFamily: POPPINS_MEDIUM,
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
        </Pressable>
    );
};
