import { Text, View, Switch } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_MEDIUM, PADDING_LARGE } from 'src/util/constants';

interface Props {
    text: string;
    onToggle: Function;
    value: boolean;
}

export const EmbtrToggle = ({ text, onToggle, value }: Props) => {
    const { colors } = useTheme();

    const toggleSwitch = (active: boolean) => {
        onToggle(!value);
    };

    return (
        <View
            style={[
                {
                    backgroundColor: colors.accent_color_faint,
                    width: '100%',
                    height: 75,
                    borderRadius: 3,
                    flexDirection: 'row',
                },
                CARD_SHADOW,
            ]}
        >
            <View style={{ flex: 1, justifyContent: 'center' }}>
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

            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'flex-end',
                    paddingRight: 30,
                }}
            >
                <Switch
                    style={{ transform: [{ scaleX: 0.65 }, { scaleY: 0.65 }] }}
                    trackColor={{
                        false: colors.toggle_background_unselected,
                        true: colors.accent_color_light,
                    }}
                    thumbColor={colors.toggle}
                    ios_backgroundColor={colors.toggle_background_unselected}
                    onValueChange={toggleSwitch}
                    value={value}
                />
            </View>
        </View>
    );
};
