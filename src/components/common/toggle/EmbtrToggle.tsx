import { Text, View, Switch } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { CARD_SHADOW, SETTINGS_MENU_ITEM_WIDTH } from 'src/util/constants';

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

    let [fontsLoaded] = useFonts({
        Poppins_500Medium,
    });

    if (!fontsLoaded) {
        return <View />;
    }

    return (
        <View
            style={[
                {
                    backgroundColor: colors.button_background,
                    width: SETTINGS_MENU_ITEM_WIDTH,
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
                        fontFamily: 'Poppins_500Medium',
                        fontSize: 15,
                        alignItems: 'flex-start',
                        paddingLeft: 30,
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
                        true: colors.toggle_background_selected,
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
