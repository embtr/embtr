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
import { POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { Image } from 'resources/schema';
import { ImageUtility } from 'src/util/images/ImageUtility';

interface Props {
    title: string;
    setTitle: (title: string) => void;
    body: string;
    setBody: (body: string) => void;
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
        layout: {
            flex: 1,
            padding: PADDING_LARGE,
        },
        container: {
            backgroundColor: '#282828',
            padding: PADDING_LARGE,
            borderRadius: 5,
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
                        <View style={{ marginBottom: PADDING_LARGE }}>
                            <Text style={[styles.header]}> Title </Text>
                            <View>
                                <Text
                                    style={{
                                        zIndex: 1,
                                        position: 'absolute',
                                        right: 2,
                                        bottom: 1,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 12,
                                        color: colors.progress_bar_failed,
                                    }}
                                >
                                    {title.length > 0 ? '' : 'required'}
                                </Text>
                                <TextInput
                                    style={[styles.container, { color: colors.text }]}
                                    placeholder={'Something on your mind?'}
                                    placeholderTextColor={colors.secondary_text}
                                    onChangeText={setTitle}
                                    value={title}
                                />
                            </View>
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text style={[styles.header]}> Story </Text>
                            <TextInput
                                style={[styles.container, { color: colors.text, height: 150 }]}
                                textAlignVertical="top"
                                multiline={true}
                                placeholder={"Let's hear it!"}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setBody}
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
