import * as React from 'react';
import {
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    Keyboard,
    TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { isIosApp } from 'src/util/DeviceUtil';
import { ScrollView } from 'react-native-gesture-handler';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import StoryController from 'src/controller/timeline/story/StoryController';
import { ImageUploadProgressReport } from 'src/controller/image/ImageController';
import { ImagesUploadingOverlay } from '../common/images/ImagesUploadingOverlay';
import { POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
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

    const styles = {
        container: {
            backgroundColor: '#282828',
            padding: TIMELINE_CARD_PADDING,
            borderRadius: 5,
        },
        layout: {
            flex: 1,
            padding: 20,
        },
        text: {
            color: colors.secondary_text,
            fontFamily: POPPINS_REGULAR,
            fontSize: 13,
        },
        header: {
            color: colors.text,
            fontSize: 17,
            fontFamily: POPPINS_REGULAR,
        },
    };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={isIosApp() ? 'padding' : 'height'}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView>
                    <ImagesUploadingOverlay
                        active={imagesUploading}
                        progress={imageUploadProgess}
                    />

                    <View style={[styles.layout]}>
                        <View style={[styles.container, { marginBottom: 10 }]}>
                            <Text style={[styles.header, { marginBottom: 5 }]}>
                                Something on your mind?
                            </Text>
                            <Text style={[styles.text]}>
                                The journey to being better than you were yesterday is filled with
                                many highs and lows. Someone out there needs to read what you're
                                thinking.
                            </Text>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[styles.header]}> Title </Text>
                            <TextInput
                                style={[styles.container]}
                                placeholder={'Enter your story title here.'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setT}
                                value={title}
                            />
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[styles.header]}> Story </Text>
                            <TextInput
                                style={[styles.container, { height: 150 }]}
                                textAlignVertical="top"
                                multiline={true}
                                placeholder={"Be someone's inspiration."}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setB}
                                value={body}
                            />
                        </View>

                        <View>
                            <Text style={[styles.header]}>Photos</Text>
                            <View>
                                <CarouselCards images={carouselImages} />
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};
