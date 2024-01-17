import React from 'react';
import { Text, View } from 'react-native';
import { ImageUploadProgressReport } from 'src/controller/image/ImageController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import { ImagesUploadingOverlay } from '../common/images/ImagesUploadingOverlay';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { Image } from 'resources/schema';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { ImageUtility } from 'src/util/images/ImageUtility';

export const TodaysPhotosWidget = () => {
    const { colors } = useTheme();
    const dispatch = useAppDispatch();

    const plannedDay = useAppSelector(getTodaysPlannedDay);

    const [imagesUploading, setImagesUploading] = React.useState(false);
    const [imageUploadProgess, setImageUploadProgress] = React.useState('');
    const [images, setImages] = React.useState<Image[]>([]);

    React.useEffect(() => {
        setImages(plannedDay.plannedDayResults?.[0]?.images ?? []);
    }, [plannedDay]);

    const uploadImage = async () => {
        setImagesUploading(true);
        setImageUploadProgress('preparing photo upload');

        const imageUrls = await DailyResultController.uploadImages(onImageUploadProgressReport);
        const images: Image[] = createImages(imageUrls);

        let plannedDayResult = await DailyResultController.getByPlannedDay(plannedDay);
        if (!plannedDayResult) {
            plannedDayResult = await DailyResultController.create(plannedDay.id ?? 0);
            if (plannedDayResult) {
                plannedDayResult.active = false;
            }
        }

        if (plannedDayResult) {
            const updatedDailyResult = await DailyResultController.addPhotos(
                images,
                plannedDayResult
            );

            if (updatedDailyResult) {
                setImages(updatedDailyResult.images ?? []);
            }
        }

        setImageUploadProgress('');
        setImagesUploading(false);
    };

    const deleteImage = async (imageUrl: string) => {
        const plannedDayResult = await DailyResultController.getOrCreate(plannedDay);
        if (!plannedDayResult) {
            return;
        }

        plannedDayResult.images?.forEach((image) => {
            if (image.url === imageUrl) {
                image.active = false;
            }
        });

        const updatedPlannedDayResult = await DailyResultController.updateViaApi(plannedDayResult);
        setImages(updatedPlannedDayResult?.images ?? []);
    };

    const createImages = (imageUrls: string[]): Image[] => {
        const images: Image[] = [];
        imageUrls.forEach((url) => {
            images.push({
                url: url,
                active: true,
            });
        });

        return images;
    };

    const carouselImages: ImageCarouselImage[] = ImageUtility.createUpdatableCarouselImages(
        images,
        uploadImage,
        deleteImage
    );

    const onImageUploadProgressReport = (progressReport: ImageUploadProgressReport) => {
        setImageUploadProgress(
            'uploading image ' + progressReport.completed + ' of ' + progressReport.total
        );
    };

    return (
        <WidgetBase>
            <ImagesUploadingOverlay active={imagesUploading} progress={imageUploadProgess} />
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                Today's Photos
            </Text>
            <View style={{ paddingTop: 10 }}>
                <CarouselCards images={carouselImages} />
            </View>
        </WidgetBase>
    );
};
