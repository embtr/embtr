import * as React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isIosApp } from 'src/util/DeviceUtil';
import { ScrollView } from 'react-native-gesture-handler';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';

interface Props {
    title: string;
    setTitle: Function;
    body: string;
    setBody: Function;
    onSubmit: Function;
}

export const CreateEditUserPostBase = ({ title, setTitle, body, setBody, onSubmit }: Props) => {
    const { colors } = useTheme();

    const [titleError, setTitleError] = React.useState(false);
    const [storyError, setStoryError] = React.useState(false);

    const setT = (t: string) => {
        setTitle(t);
    };

    const setB = (b: string) => {
        setBody(b);
    };

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
    });

    if (!fontsLoaded) {
        return <View />;
    }

    let images: ImageCarouselImage[] = [
        {
            url: '',
            format: '',
            type: 'add_image',
        },
        {
            url: 'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/timeline%2Fhorizontal.jpeg?alt=media&token=1cb00109-cb1d-4a11-855f-99c93688e9a5',
            format: 'HORIZONTAL',
            type: 'image',
        },
        {
            url: 'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/timeline%2Fvertical.jpeg?alt=media&token=a3aefa6f-34f5-45c7-864e-cd2621feca82',
            format: 'VERTICAL',
            type: 'image',
        },
        {
            url: 'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/timeline%2Fhorizontal.jpeg?alt=media&token=1cb00109-cb1d-4a11-855f-99c93688e9a5',
            format: 'HORIZONTAL',
            type: 'image',
        },
        {
            url: 'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/timeline%2Fvertical.jpeg?alt=media&token=a3aefa6f-34f5-45c7-864e-cd2621feca82',
            format: 'VERTICAL',
            type: 'image',
        },
    ];

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{}}>
            <View style={{ height: '100%', width: '100%' }}>
                <KeyboardAvoidingView style={{ height: '100%' }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                    {/* TOP SUMMARY */}
                    <View style={{ paddingTop: 5 }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, fontFamily: 'Poppins_600SemiBold', fontSize: 17, paddingTop: 10, paddingLeft: 15 }}
                        >
                            Something on your mind?
                        </Text>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.secondary_text,
                                fontFamily: 'Poppins_400Regular',
                                paddingTop: 10,
                                fontSize: 12,
                                paddingLeft: 15,
                                paddingRight: 15,
                            }}
                        >
                            The journey to being better than you were yesterday is filled with many highs and lows. Someone out there needs to read what you're
                            thinking.
                        </Text>
                    </View>

                    {/* TITLE */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingTop: 15, paddingLeft: 5, width: '95%', paddingBottom: 10 }}
                        >
                            Title
                        </Text>
                        <TextInput
                            style={{
                                padding: 15,
                                color: colors.text,
                                borderRadius: 12,
                                backgroundColor: colors.text_input_background,
                                borderColor: colors.text_input_border,
                                borderWidth: 1,
                                width: '95%',
                            }}
                            placeholder={'Enter Your Story Title'}
                            placeholderTextColor={colors.secondary_text}
                            onChangeText={setT}
                            onChange={() => {
                                setTitleError(false);
                            }}
                            value={title}
                        />
                    </View>

                    {/* STORY */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 10 }}
                        >
                            Story
                        </Text>
                        <TextInput
                            textAlignVertical="top"
                            style={{
                                width: '95%',
                                height: 200,
                                borderRadius: 12,
                                backgroundColor: colors.text_input_background,
                                borderColor: colors.text_input_border,
                                borderWidth: 1,
                                color: colors.text,
                                paddingTop: 10,
                                paddingLeft: 10,
                                paddingRight: 10,
                            }}
                            multiline={true}
                            placeholder={"Be someone's inspiration."}
                            placeholderTextColor={colors.secondary_text}
                            onChangeText={setB}
                            onChange={() => {
                                setStoryError(false);
                            }}
                            value={body}
                        />
                    </View>

                    {/* PHOTOS */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 10 }}
                        >
                            Photos
                        </Text>
                        <View>
                            <CarouselCards images={images} />
                        </View>
                    </View>

                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <View style={{ width: '95%' }}>
                            <EmbtrButton
                                buttonText={'Submit'}
                                callback={() => {
                                    onSubmit();
                                }}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ScrollView>
    );
};
