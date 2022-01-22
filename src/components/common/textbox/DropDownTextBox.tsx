import * as React from 'react';
import { TextStyle, Animated, ViewStyle, TextInput } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useRef } from 'react';

interface Props {
    text: string,
    textSize: number,
    onChangeText: Function,
    placeholder?: string,
    display: boolean
}

export const DropDownTextBox = ({ text, textSize, onChangeText, placeholder, display }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        color: colors.text,
    } as TextStyle;

    const inputStyle = {
        borderWidth: display ? 1 : 0,
        borderRadius: 25,
        borderColor: colors.pillar_attribute,
    } as ViewStyle;

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeIn = () => {
        // Will change fadeAnim value to 1 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 50,
            duration: 250,
            useNativeDriver: false
        }).start();
    };

    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 250,
            useNativeDriver: false
        }).start();
    };

    if (display) {
        fadeIn();
    } else {
        fadeOut();
    }

    return (
        <Animated.View style={{ height: fadeAnim, justifyContent: "center" }}>
            <TextInput
                style={[textStyle, inputStyle, { fontSize: 14, overflow: "hidden", paddingTop: 5, paddingBottom: 5, paddingRight: 20, paddingLeft: 20, marginRight: 20, marginLeft: 20 }]}
                onChangeText={(text: string) => { onChangeText(text) }}
                value={display ? text : ""}
                placeholder={display ? placeholder : ""} />
        </Animated.View>
    );
}