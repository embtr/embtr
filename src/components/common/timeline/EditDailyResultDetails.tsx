import React from 'react';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TextStyle, KeyboardAvoidingView, Keyboard, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ImageUploadProgressReport } from 'src/controller/image/ImageController';
import PlannedDayController, { getDateFromDayKey, PlannedDay, plannedDayIsComplete } from 'src/controller/planning/PlannedDayController';
import { getDayOfWeek } from 'src/controller/planning/TaskController';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { isIosApp } from 'src/util/DeviceUtil';
import { Banner } from '../Banner';
import { EmbtrButton } from '../button/EmbtrButton';
import { CarouselCards, ImageCarouselImage } from '../images/ImageCarousel';
import { DailyResultCardElement } from './DailyResultCardElement';
import { Screen } from 'src/components/common/Screen';
import { ImagesUploadingOverlay } from '../images/ImagesUploadingOverlay';

export const EditDailyResultDetails = () => {
    const { colors } = useTheme();

    const route = useRoute<RouteProp<TimelineTabScreens, 'EditDailyResultDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [dailyResult, setDailyResult] = React.useState<DailyResultModel>();
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();

    const [imagesUploading, setImagesUploading] = React.useState(false);
    const [imageUploadProgess, setImageUploadProgress] = React.useState('');

    const [updatedImageUrls, setUpdatedImageUrls] = React.useState<string[]>([]);
    const [updatedDescription, setUpdatedDescription] = React.useState<string>('');

    useFocusEffect(
        React.useCallback(() => {
            DailyResultController.get(route.params.id, (dailyResult: DailyResultModel) => {
                if (dailyResult.data.description) {
                    setUpdatedDescription(dailyResult.data.description);
                }

                if (dailyResult.data.imageUrls) {
                    setUpdatedImageUrls(dailyResult.data.imageUrls);
                }

                PlannedDayController.get(dailyResult.uid, dailyResult.data.plannedDayId, setPlannedDay);
                setDailyResult(dailyResult);
            });
        }, [])
    );

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

    let completedCount = 0;
    plannedDay?.plannedTasks.forEach((plannedTask) => {
        if (plannedTask.status === 'COMPLETE') {
            completedCount += 1;
        }
    });
    const progress = plannedDay ? (completedCount / plannedDay.plannedTasks.length) * 100 : 100;
    const dayOfWeek = getDayOfWeek(getDateFromDayKey(plannedDay?.id ? plannedDay?.id : ''));

    let plannedTaskViews: JSX.Element[] = [];
    plannedDay?.plannedTasks.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View key={plannedTask.id} style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    const onImageUploadProgressReport = (progressReport: ImageUploadProgressReport) => {
        setImageUploadProgress('uploading image ' + progressReport.completed + ' of ' + progressReport.total);
    };

    const updateImages = (images: string[]) => {
        let clonedList = [...updatedImageUrls];
        clonedList = clonedList.concat(images);
        setUpdatedImageUrls(clonedList);
    };

    const uploadImage = async () => {
        setImagesUploading(true);
        setImageUploadProgress('preparing photo upload');
        const imageUrls = await DailyResultController.uploadImages(onImageUploadProgressReport);
        updateImages(imageUrls);
        setImageUploadProgress('');
        setImagesUploading(false);
    };

    const onDeleteImage = (deletedImageUrl: string) => {
        let imageUrls: string[] = [];
        updatedImageUrls.forEach((imageUrl) => {
            if (imageUrl !== deletedImageUrl) {
                imageUrls.push(imageUrl);
            }
        });
        setUpdatedImageUrls(imageUrls);
    };

    let carouselImages: ImageCarouselImage[] = [
        {
            url: '',
            format: '',
            type: 'add_image',
            uploadImage: uploadImage,
        },
    ];
    updatedImageUrls.forEach((image) => {
        carouselImages.push({
            url: image,
            format: 'png',
            type: 'image',
            onDelete: onDeleteImage,
        });
    });

    if (!plannedDay || !dailyResult) {
        return <View />;
    }

    const onSubmit = () => {
        let clonedDailyResult = DailyResultController.clone(dailyResult);
        clonedDailyResult.data.description = updatedDescription;
        clonedDailyResult.data.imageUrls = updatedImageUrls;
        DailyResultController.update(clonedDailyResult);
        navigation.goBack();
    };

    return (
        <Screen>
            <ImagesUploadingOverlay active={imagesUploading} progress={imageUploadProgess} />

            <Banner name="Edit Daily Result" leftIcon="arrow-back" leftRoute="BACK" />
            <ScrollView>
                <KeyboardAvoidingView style={{ height: '100%' }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>
                    <View style={{ paddingTop: 10 }}>
                        {/* PROGRESS BAR */}
                        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{ color: colors.text, paddingLeft: 5, width: '95%', paddingBottom: 10 }}
                            >
                                Progress
                            </Text>
                            <View style={{ width: '94%', alignItems: 'center', justifyContent: 'center' }}>
                                <ProgressBar progress={progress} success={plannedDayIsComplete(plannedDay)} />
                            </View>
                        </View>

                        {/* COMPLETED/ FAILED */}
                        <View style={{ paddingTop: 5 }}>
                            <Text style={headerTextStyle}>
                                {dayOfWeek.substring(0, 1).toUpperCase() + dayOfWeek.substring(1)}{' '}
                                <Text style={{ color: plannedDayIsComplete(plannedDay) ? colors.progress_bar_complete : colors.progress_bar_failed }}>
                                    {plannedDayIsComplete(plannedDay) ? 'Complete!' : 'Failed!'}
                                </Text>
                            </Text>
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

                        {/* SUBMIT */}
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
                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
        </Screen>
    );
};
