import * as React from 'react';
import { Text, View, Switch } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';


interface Props {
    text: string,
    onToggle: Function,
    initialValue: boolean
}

export const EmbtrToggle = ({ text, onToggle, initialValue }: Props) => {
    const { colors } = useTheme();

    const [isEnabled, setIsEnabled] = React.useState(initialValue);
    const toggleSwitch = (active: boolean) => {
        setIsEnabled(active)
        onToggle(!isEnabled);
    };

    let [fontsLoaded] = useFonts({
        Poppins_500Medium,
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View style={{ backgroundColor: colors.button_background, width: "90%", height: 75, borderRadius: 15, flexDirection: "row" }}>

            <View style={{ flex: 1, justifyContent: "center" }} >
                <Text style={{ color: colors.button_text, fontFamily: "Poppins_500Medium", fontSize: 15, alignItems: "flex-start", paddingLeft: 30 }}>{text}</Text>
            </View>

            <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-end", paddingRight: 30 }}>
                <Switch
                    style={{ transform: [{ scaleX: .8 }, { scaleY: .8 }] }}
                    trackColor={{ false: colors.toggle_background_unselected, true: colors.toggle_background_selected }}
                    thumbColor={colors.toggle}
                    ios_backgroundColor={colors.toggle_background_unselected}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>

        </View>
    );
}
