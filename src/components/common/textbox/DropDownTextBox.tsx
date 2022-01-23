import * as React from 'react';
import { TextStyle, Animated, ViewStyle, TextInput, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useRef } from 'react';

interface Props {
    text: string,
    textSize: number,
    onChangeText: Function,
    onSubmitText: Function,
    placeholder?: string,
    display: boolean
}

export const DropDownTextBox = ({ text, textSize, onChangeText, onSubmitText, placeholder, display }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        color: colors.text,
    } as TextStyle;

    const inputStyle = {
        borderRadius: 25,
        borderColor: colors.pillar_attribute,
    } as ViewStyle;

    const [collapsed, setCollapsed] = React.useState(display);

    const commentBoxRef = useRef<TextInput>(null);


    const textWindowAnimatedHeight = useRef(new Animated.Value(0)).current;
    textWindowAnimatedHeight.addListener((result) => {
        if (result.value == 0) {
            setCollapsed(true);
        }

        if (result.value == 50) {
            setCollapsed(false);
        }
    });


    const fadeIn = (value: Animated.Value, to: number) => {
        Animated.timing(value, {
            toValue: to,
            duration: 250,
            useNativeDriver: false
        }).start();
    };

    const fadeOut = (value: Animated.Value, to: number) => {
        Animated.timing(value, {
            toValue: to,
            duration: 250,
            useNativeDriver: false
        }).start();
    };

    if (display) {
        fadeIn(textWindowAnimatedHeight, 50);
        commentBoxRef.current?.focus();
    } else {
        fadeOut(textWindowAnimatedHeight, 0);
    }

    return (
        <View >
            <Animated.View style={{ height: textWindowAnimatedHeight, alignItems: "flex-end", justifyContent: "center" }}>
                <TextInput
                    ref={commentBoxRef}
                    style={[textStyle, inputStyle, {
                        width: "90%",
                        marginRight: "5%",
                        fontSize: 14,
                        overflow: "hidden",
                        paddingTop: collapsed ? 0 : 5,
                        paddingBottom: collapsed ? 0 : 5,
                        borderWidth: collapsed ? 0 : 1,
                        paddingLeft: 15
                    }]}
                    onChangeText={(text: string) => { onChangeText(text) }}
                    onSubmitEditing={() => { onSubmitText() }}
                    value={display ? text : ""}
                    placeholder={display ? placeholder : ""}
                    placeholderTextColor={colors.secondary_text}
                    autoFocus={true} />

                <View style={{ zIndex: 1, position: "absolute", paddingRight:"5%" }}>
                    {display && <View>
                        <Text onPress={() => { onSubmitText() }} style={{
                            fontSize: 16,
                            color: colors.primary_border,
                        }}>send   </Text>
                    </View>}
                </View>


            </Animated.View>



        </View>
    );
}