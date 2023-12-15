import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_MEDIUM, TIMELINE_CARD_PADDING } from 'src/util/constants';

interface Props {
    text: string;
    secondaryText: string;
    thirdaryText: string;
    onPress?: Function;
}

export const SettingsTextElement = ({ text, secondaryText, thirdaryText, onPress }: Props) => {
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
                            paddingLeft: TIMELINE_CARD_PADDING * 2,
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
        </Pressable>
    );
};
