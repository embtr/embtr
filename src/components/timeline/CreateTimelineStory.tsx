import * as React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isIosApp } from 'src/util/DeviceUtil';
import { ScrollView } from 'react-native-gesture-handler';
import StoryController from 'src/controller/timeline/story/StoryController';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';

export const CreateTimelineStory = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

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
                navigation.navigate("Timeline");
            });
        }
    }

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <Screen>
            <Banner name='Share A Story' leftIcon={"arrow-back"} leftRoute="BACK" />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{}}>
                <View style={{ height: "100%", width: "100%" }}>
                    <KeyboardAvoidingView style={{ height: "100%" }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>

                        <View style={{ paddingTop: 5 }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, fontFamily: "Poppins_600SemiBold", fontSize: 17, paddingTop: 10, paddingLeft: 15 }}>Something on your mind?</Text>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.secondary_text, fontFamily: "Poppins_400Regular", paddingTop: 10, fontSize: 12, paddingLeft: 15, paddingRight: 15 }}>The journey to being better than you were yesterday is filled with many highs and lows. Someone out there needs to read what you're thinking.</Text>
                        </View>

                        <View style={{ paddingTop: 10, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, paddingTop: 15, paddingLeft: 5, width: "95%", paddingBottom: 10 }}>Title</Text>
                            <TextInput
                                style={{ padding: 15, color: colors.text, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, width: "95%" }}
                                placeholder={"Enter Your Story Title"}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setTitle}
                                onChange={() => { setTitleError(false) }}
                                value={title}
                            />
                        </View>

                        <View style={{ paddingTop: 10, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.text, paddingLeft: 5, width: "95%", paddingBottom: 10 }}>Story</Text>
                            <TextInput
                                textAlignVertical='top'
                                style={{ width: "95%", height: 200, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, color: colors.text, paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}
                                multiline={true}
                                placeholder={"Be someone's inspiration."}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setBody}
                                onChange={() => { setStoryError(false) }}
                                value={body}
                            />
                        </View>

                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'stretch', margin: 5, paddingBottom: 15 }}>
                            <View style={{ width: "95%" }}>
                                <EmbtrButton buttonText={'Submit'} callback={submitStory} />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </Screen>
    );
}