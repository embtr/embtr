import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TextStyle, KeyboardAvoidingView, Keyboard, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ImageUploadProgressReport } from 'src/controller/image/ImageController';
import { getDayOfWeek } from 'src/controller/planning/TaskController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { isIosApp } from 'src/util/DeviceUtil';
import { Banner } from '../Banner';
import { CarouselCards, ImageCarouselImage } from '../images/ImageCarousel';
import { DailyResultCardElement } from './DailyResultCardElement';
import { Screen } from 'src/components/common/Screen';
import { ImagesUploadingOverlay } from '../images/ImagesUploadingOverlay';
import { PlannedDayResultImage as PlannedDayResultImageModel, PlannedDayResult as PlannedDayResultModel } from 'resources/schema';

export const EditDailyResultDetails = () => {
    const { colors } = useTheme();

    const route = useRoute<RouteProp<TimelineTabScreens, 'EditDailyResultDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [plannedDayResult, setPlannedDayResult] = React.useState<PlannedDayResultModel>();

    const [imagesUploading, setImagesUploading] = React.useState(false);
    const [imageUploadProgess, setImageUploadProgress] = React.useState('');

    const [updatedImageUrls, setUpdatedImageUrls] = React.useState<PlannedDayResultImageModel[]>([]);
    const [updatedDescription, setUpdatedDescription] = React.useState<string>('');

    const [carouselImages, setCarouselImages] = React.useState<ImageCarouselImage[]>([]);

    React.useEffect(() => {
        const fetchPlannedDayResult = async () => {
            const foundPlannedDayResult = await DailyResultController.getViaApi(route.params.id);
            setPlannedDayResult(foundPlannedDayResult);

            if (foundPlannedDayResult.description) {
                setUpdatedDescription(foundPlannedDayResult.description);
            }

            if (foundPlannedDayResult?.plannedDayResultImages) {
                setUpdatedImageUrls(foundPlannedDayResult.plannedDayResultImages);
            }
        };

        fetchPlannedDayResult();
    }, []);

    const addUploadedImages = (images: string[]) => {
        let clonedList = [...updatedImageUrls];
        for (const image of images) {
            clonedList.push({ url: image, active: true });
        }

        setUpdatedImageUrls(clonedList);
    };

    const uploadImage = async () => {
        setImagesUploading(true);
        setImageUploadProgress('preparing photo upload');
        const imageUrls = await DailyResultController.uploadImages(onImageUploadProgressReport);
        addUploadedImages(imageUrls);
        setImageUploadProgress('');
        setImagesUploading(false);
    };

    React.useEffect(() => {
        let newCarouselImages: ImageCarouselImage[] = [];
        updatedImageUrls.forEach((image) => {
            if (!image.url || !image.active) {
                return;
            }

            newCarouselImages.push({
                url: image.url,
                format: 'png',
                type: 'image',
                onDelete: onDeleteImage,
            });
        });

        newCarouselImages.push({
            url: '',
            format: '',
            type: 'add_image',
            uploadImage: uploadImage,
        });

        setCarouselImages(newCarouselImages);
    }, [updatedImageUrls]);

    if (!plannedDayResult) {
        return <View />;
    }

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

    let dayOfWeek = '';
    if (plannedDayResult.plannedDay?.createdAt) {
        dayOfWeek = getDayOfWeek(plannedDayResult.plannedDay.createdAt);
    }

    let plannedTaskViews: JSX.Element[] = [];
    plannedDayResult?.plannedDay?.plannedTasks?.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View key={plannedTask.id} style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    const onImageUploadProgressReport = (progressReport: ImageUploadProgressReport) => {
        setImageUploadProgress('uploading image ' + progressReport.completed + ' of ' + progressReport.total);
    };

    const onDeleteImage = (deletedImageUrl: string) => {
        console.log('deleting!');
        let updatedImages: PlannedDayResultImageModel[] = updatedImageUrls.map((image) => {
            if (image.url === deletedImageUrl) {
                console.log('deleting image: ', image.url);
                image.active = false;
            }

            return { ...image };
        });

        console.log('updated images: ', updatedImages);
        setUpdatedImageUrls(updatedImages);
    };

    const onSubmit = async () => {
        const clonedPlannedDayResult: PlannedDayResultModel = { ...plannedDayResult };
        clonedPlannedDayResult.description = updatedDescription;
        //clonedPlannedDayResult.plannedDayResultImages = updatedImageUrls.map((url) => {
        //    return { url };
        //});
        clonedPlannedDayResult.plannedDayResultImages = updatedImageUrls;

        //let clonedDailyResult = DailyResultController.clone(dailyResult);
        //clonedDailyResult.data.description = updatedDescription;
        //clonedDailyResult.data.imageUrls = updatedImageUrls;
        //DailyResultController.update(clonedDailyResult);
        await DailyResultController.updateViaApi(clonedPlannedDayResult);
        navigation.goBack();
    };

    return (
        <Screen>
            <ImagesUploadingOverlay active={imagesUploading} progress={imageUploadProgess} />

            <Banner name="Edit Daily Result" leftText={'Cancel'} leftRoute="BACK" rightText={'Save'} rightOnClick={onSubmit} />
            <ScrollView>
                <KeyboardAvoidingView style={{ height: '100%' }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                    <View style={{ paddingTop: 10 }}>
                        {/* COMPLETED/ FAILED */}
                        {dayOfWeek && (
                            <View style={{ paddingTop: 5 }}>
                                <Text style={headerTextStyle}>
                                    {dayOfWeek.substring(0, 1).toUpperCase() + dayOfWeek.substring(1)}{' '}
                                    <Text style={{ color: colors.progress_bar_complete }}>'Complete!'</Text>
                                </Text>
                            </View>
                        )}

                        {/* TASKS */}

                        <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 20 }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 10 }}
                            >
                                Tasks
                            </Text>
                            <View>{plannedTaskViews}</View>
                        </View>

                        {/* STORY */}
                        <View style={{ paddingTop: 20, alignItems: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 10 }}
                            >
                                Description
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
                                placeholder={'How did the day go?'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setUpdatedDescription}
                                value={updatedDescription}
                            />
                        </View>

                        {/* PHOTOS */}
                        <View style={{ paddingTop: 20, alignItems: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 10 }}
                            >
                                Photos
                            </Text>
                            <View>
                                <CarouselCards images={carouselImages} />
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </Screen>
    );
};
