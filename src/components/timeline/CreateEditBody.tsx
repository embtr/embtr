import React from 'react';
import { PADDING_LARGE, PADDING_MEDIUM, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { TextInput, View, Text, ActivityIndicator, Animated } from 'react-native';
import { CarouselCardsMini } from '../common/images/ImageCarouselMini';
import { useTheme } from '../theme/ThemeProvider';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'resources/schema';
import { ImageUtility } from 'src/util/images/ImageUtility';
import ImageController from 'src/controller/image/ImageController';
import { Interactable } from 'resources/types/interactable/Interactable';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import StoryController from 'src/controller/timeline/story/StoryController';
import { ImagesUploadingOverlay } from '../common/images/ImagesUploadingOverlay';

const getUploadBucket = (interactable: Interactable) => {
    switch (interactable) {
        case Interactable.PLANNED_DAY_RESULT:
            return DailyResultController.UPLOAD_BUCKET;
        case Interactable.USER_POST:
            return StoryController.UPLOAD_BUCKET;
    }

    return undefined;
};

interface Props {
    interactable: Interactable;
    images: Image[];
    body: string;
    onSubmit: (body: string, images: Image[]) => void;
}

export const CreateEditBody = ({ images, body, onSubmit, interactable }: Props) => {
    const colors = useTheme().colors;
    const [updatedBody, setUpdatedBody] = React.useState(body);
    const [updatedImages, setUpdatedImages] = React.useState(images);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [imagesUploading, setImagesUploading] = React.useState(false);
    const [imageUploadProgess, setImageUploadProgess] = React.useState('');

    const [isShaking, setIsShaking] = React.useState(false);
    const shakeAnimation = React.useRef(new Animated.Value(0)).current;

    const textApproachingMax = updatedBody.length > 700;
    const textOverMax = updatedBody.length > 750;

    const shakeAggression = 2.5;
    const shakeText = () => {
        if (textOverMax) {
            setIsShaking(true);
            Animated.sequence([
                Animated.timing(shakeAnimation, {
                    toValue: shakeAnimation,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: -shakeAggression,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: shakeAggression,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: -shakeAggression,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: shakeAggression,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(shakeAnimation, {
                    toValue: 0,
                    duration: 50,
                    useNativeDriver: true,
                }),
            ]).start(() => setIsShaking(false));
        }
    };

    const onSubmitPressed = async () => {
        if (textOverMax) {
            shakeText();
            return;
        }

        setIsSubmitting(true);
        onSubmit(updatedBody, updatedImages);
    };

    const uploadImage = async () => {
        setImagesUploading(true);
        setImageUploadProgess('Uploading Image');
        const bucket = getUploadBucket(interactable);
        if (!bucket) {
            return;
        }

        const uploadedUrl = await ImageController.pickAndUploadImage(bucket);
        setUpdatedImages([...updatedImages, { url: uploadedUrl }]);
        setImagesUploading(false);
        setImageUploadProgess('');
    };

    const deleteImage = async (imageUrl: string) => {
        const updatedImagesCopy = [];
        for (const image of updatedImages) {
            if (image.url === imageUrl) {
                if (image.id) {
                    updatedImagesCopy.push({ ...image, active: false });
                }
            } else {
                updatedImagesCopy.push(image);
            }
        }

        setUpdatedImages(updatedImagesCopy);
    };

    const carouselImages = ImageUtility.createDeleteOnlyCarouselImages(updatedImages, deleteImage);

    return (
        <View
            style={{
                backgroundColor: '#282828',
                borderRadius: 5,
                padding: PADDING_LARGE,
            }}
        >
            <ImagesUploadingOverlay active={imagesUploading} progress={imageUploadProgess} />

            {updatedImages.length > 0 && <CarouselCardsMini images={carouselImages} />}

            <TextInput
                style={{
                    color: colors.text,
                    height: getWindowHeight() * 0.3,
                }}
                textAlignVertical="top"
                multiline={true}
                placeholder={"Let's hear it!"}
                placeholderTextColor={colors.secondary_text}
                onChangeText={setUpdatedBody}
                value={updatedBody}
            />
            <View
                style={{
                    width: '100%',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: PADDING_MEDIUM,
                }}
            >
                <Ionicons
                    onPress={uploadImage}
                    name={'image-outline'}
                    size={25}
                    color={colors.secondary_text}
                />

                <View style={{ flex: 1 }} />

                <Animated.View
                    style={{
                        transform: [{ translateX: isShaking ? shakeAnimation : 0 }],
                    }}
                >
                    <Text
                        style={{
                            color: textOverMax
                                ? colors.progress_bar_failed
                                : textApproachingMax
                                    ? colors.text_approaching_max
                                    : colors.secondary_text,
                            fontSize: 11,
                            fontFamily: POPPINS_REGULAR,
                            paddingRight: PADDING_SMALL,
                            top: 1,
                        }}
                    >
                        {updatedBody.length > 600 ? updatedBody.length + '/750' : ' '}
                    </Text>
                </Animated.View>
                {isSubmitting ? (
                    <ActivityIndicator color={colors.text} animating size="small" />
                ) : (
                    <View style={{ opacity: textOverMax ? 0.3 : 1 }}>
                        <Ionicons
                            onPress={onSubmitPressed}
                            name={'paper-plane-outline'}
                            size={26}
                            color={colors.link}
                        />
                    </View>
                )}
            </View>
        </View>
    );
};
