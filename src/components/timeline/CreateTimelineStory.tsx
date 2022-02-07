import * as React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isIosApp } from 'src/util/DeviceUtil';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import StoryController from 'src/controller/timeline/story/StoryController';

export const CreateTimelineStory = () => {
    const { colors } = useTheme();

    const [title, setTitle] = React.useState<string>("");
    const [body, setBody] = React.useState<string>("");

    const [titleError, setTitleError] = React.useState(false);
    const [storyError, setStoryError] = React.useState(false);

    const submitStory = () => {
        let readyToSubmit = true;

        if (title.length === 0) {
            setTitleError(true);
            readyToSubmit = false;
        }

        if (body.length === 0) {
            setStoryError(true);
            readyToSubmit = false;
        }

        if (readyToSubmit) {
            StoryController.addStory(title, body, () => {
                //TODO - navigate back
                alert("story Sent!");
            });
        }
    }

    return (
        <Screen>
            <Banner name='Share A Story' leftIcon={"arrow-back"} leftRoute="BACK" rightIcon={'paper-plane-outline'} rightOnClick={submitStory} />

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <View style={{ paddingTop: 5 }}>
                    <Text style={{ color: colors.text, textAlign: "center", padding: 15 }}>Something on your mind?</Text>
                    <Text style={{ color: colors.secondary_text, fontSize: 12, paddingLeft: 15, paddingRight: 15 }}>The journey to being better than you were yesterday is filled with many highs and lows. Someone out there needs to read what you're thinking. Let it out.</Text>
                </View>
            </TouchableWithoutFeedback>

            <View style={{ paddingTop: 10 }}>
                <View style={{ paddingLeft: 5 }}>
                    <Text style={{ color: "red", fontSize: 12 }}>{ titleError && "title is required" }</Text>
                </View>
                <TextInput
                    style={{ padding: 15, color: colors.text, backgroundColor: colors.background_secondary, width: "100%" }}
                    placeholder={"Title"}
                    placeholderTextColor={colors.secondary_text}
                    onChangeText={setTitle}
                    onChange={() => { setTitleError(false) }}
                    value={title}
                />
            </View>

            <KeyboardAvoidingView style={{ flex: 1 }} keyboardVerticalOffset={isIosApp() ? 45 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                <View style={{ paddingTop: 10, height: "100%" }}>
                <View style={{ paddingLeft: 5 }}>
                    <Text style={{ color: "red", fontSize: 12 }}>{ storyError && "share your story." }</Text>
                </View>
                    <TextInput
                        style={{ height: "95%", color: colors.text, backgroundColor: colors.background_secondary, width: "100%", paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}
                        multiline={true}
                        placeholder={"Story. Be someone's inspiration."}
                        placeholderTextColor={colors.secondary_text}
                        onChangeText={setBody}
                        onChange={() => { setStoryError(false) }}
                        value={body}
                    />
                </View>
            </KeyboardAvoidingView>
        </Screen>
    );
}