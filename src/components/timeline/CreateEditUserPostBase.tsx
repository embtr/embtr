import * as React from 'react';
import { View, Text, TextInput, KeyboardAvoidingView, Keyboard } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isIosApp } from 'src/util/DeviceUtil';
import { ScrollView } from 'react-native-gesture-handler';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import StoryController from 'src/controller/timeline/story/StoryController';
import { ImageUploadProgressReport } from 'src/controller/image/ImageController';
import { ImagesUploadingOverlay } from '../common/images/ImagesUploadingOverlay';
import { POPPINS_REGULAR } from 'src/util/constants';
import { Image } from 'resources/schema';
import { ImageUtility } from 'src/util/images/ImageUtility';

interface Props {
    title: string;
    setTitle: Function;
    body: string;
    setBody: Function;
    images: Image[];
    onImagesUploaded: Function;
    onDeleteImage?: Function;
}

export const CreateEditUserPostBase = ({
    title,
    setTitle,
    body,
    setBody,
    images,
    onImagesUploaded,
    onDeleteImage,
}: Props) => {
    const { colors } = useTheme();

    const [imagesUploading, setImagesUploading] = React.useState(false);
    const [imageUploadProgess, setImageUploadProgress] = React.useState('');

    const setT = (t: string) => {
        setTitle(t);
    };

    const setB = (b: string) => {
        setBody(b);
    };

    const onImageUploadProgressReport = (progressReport: ImageUploadProgressReport) => {
        setImageUploadProgress(
            'uploading image ' + progressReport.completed + ' of ' + progressReport.total
        );
    };

    const uploadImage = async () => {
        setImagesUploading(true);
        setImageUploadProgress('preparing photo upload');
        const imageUrls = await StoryController.uploadImages(onImageUploadProgressReport);
        onImagesUploaded(imageUrls);
        setImageUploadProgress('');
        setImagesUploading(false);
    };

    let carouselImages: ImageCarouselImage[] = ImageUtility.createUpdatableCarouselImages(
        images,
        uploadImage,
        onDeleteImage
    );

    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} style={{}}>
            <ImagesUploadingOverlay active={imagesUploading} progress={imageUploadProgess} />

            <View style={{ height: '100%', width: '100%' }}>
                <KeyboardAvoidingView
                    style={{ height: '100%' }}
                    keyboardVerticalOffset={isIosApp() ? -10 : 111}
                    behavior={isIosApp() ? 'padding' : 'height'}
                >
                    {/* TOP SUMMARY */}
                    <View style={{ paddingTop: 5 }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.text,
                                fontFamily: 'Poppins_600SemiBold',
                                fontSize: 17,
                                paddingTop: 10,
                                paddingLeft: 15,
                            }}
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
                            The journey to being better than you were yesterday is filled with many
                            highs and lows. Someone out there needs to read what you're thinking.
                        </Text>
                    </View>

                    {/* TITLE */}
                    <View style={{ paddingTop: 10, paddingLeft: 10 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    color: colors.text,
                                    paddingTop: 15,
                                    paddingLeft: 5,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                Title
                            </Text>

                            {title.length < 1 && (
                                <Text
                                    onPress={() => {
                                        Keyboard.dismiss();
                                    }}
                                    style={{
                                        alignSelf: 'flex-end',
                                        color: colors.tab_selected,
                                        paddingLeft: 5,
                                        paddingBottom: 3,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 10,
                                    }}
                                >
                                    cannot be blank
                                </Text>
                            )}
                        </View>
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
                            value={title}
                        />
                    </View>

                    {/* STORY */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.text,
                                paddingLeft: 5,
                                width: '95%',
                                paddingBottom: 10,
                            }}
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
                            value={body}
                        />
                    </View>

                    {/* PHOTOS */}
                    <View style={{ paddingTop: 10, alignItems: 'center' }}>
                        <Text
                            onPress={() => {
                                Keyboard.dismiss();
                            }}
                            style={{
                                color: colors.text,
                                paddingLeft: 5,
                                width: '95%',
                                paddingBottom: 10,
                            }}
                        >
                            Photos
                        </Text>
                        <View>
                            <CarouselCards images={carouselImages} />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </ScrollView>
    );
};
