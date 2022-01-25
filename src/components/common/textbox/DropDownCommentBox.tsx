import * as React from 'react';
import { TextStyle, Animated, ViewStyle, TextInput, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useRef } from 'react';
import { DropDownCommentPreview } from 'src/components/common/textbox/DropDownCommentPreview';
import { Comment } from 'src/controller/explore/ExploreController';
import { Keyboard } from 'react-native'; 

interface Props {
    onSubmitText: Function,
    placeholder?: string,
    display: boolean,
    displayComment?: Comment
}

const MAX_DROPDOWN_HEIGHT = 40;

export const DropDownCommentBox = ({ onSubmitText, placeholder, display, displayComment }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        color: colors.text,
    } as TextStyle;

    const inputStyle = {
        borderRadius: 25,
        borderColor: colors.pillar_attribute,
    } as ViewStyle;

    const [text, setText] = React.useState("");
    const [collapsed, setCollapsed] = React.useState(display);

    const commentWindowAnimatedHeight = useRef(new Animated.Value(0)).current;
    const textWindowAnimatedHeight = useRef(new Animated.Value(0)).current;
    textWindowAnimatedHeight.addListener((result) => {
        if (result.value == 0) {
            setCollapsed(true);
        }

        if (result.value == MAX_DROPDOWN_HEIGHT) {
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
        fadeIn(commentWindowAnimatedHeight, 45);
        fadeIn(textWindowAnimatedHeight, MAX_DROPDOWN_HEIGHT);
    } else {
        fadeOut(commentWindowAnimatedHeight, 0);
        fadeOut(textWindowAnimatedHeight, 0);
    }

    const handleSubmitText = () => {
        Keyboard.dismiss();
        onSubmitText(text);
        setText("");
    };


    return (
        <View>
            <Animated.View style={{ height: commentWindowAnimatedHeight, overflow: "hidden", alignItems: "flex-end", justifyContent:"flex-end" }}>
                <View style={{ width: "100%", marginBottom:10 }}>
                    {displayComment !== undefined && <DropDownCommentPreview comment={displayComment!} /> }
                </View>
            </Animated.View>
            <Animated.View style={{ height: textWindowAnimatedHeight, alignItems: "flex-end" }}>
                <View style={{ marginBottom: 10, width: "100%", height: !display ? 0 : "auto", alignItems: "flex-end", justifyContent: "center", overflow: "hidden" }}>
                    <TextInput
                        style={[textStyle, inputStyle, {
                            width: "90%",
                            marginRight: "5%",
                            fontSize: 14,
                            paddingTop: 5,
                            paddingBottom: 5,
                            borderWidth: collapsed ? 0 : 1,
                            paddingLeft: 15,
                            paddingRight:55
                        }]}
                        onChangeText={(text: string) => { setText(text) }}
                        onSubmitEditing={handleSubmitText}
                        value={display ? text : ""}
                        placeholder={display ? placeholder : ""}
                        placeholderTextColor={colors.secondary_text}
                        selectionColor={undefined}
                        autoFocus={false} />

                    <View style={{ zIndex: 1, position: "absolute", paddingRight: "5%" }}>
                        {display && <View>
                            <Text onPress={handleSubmitText} style={{ fontSize: 16, color: colors.primary_border, }}>send   </Text>
                        </View>}
                    </View>
                </View>
            </Animated.View>
        </View>
    );
}