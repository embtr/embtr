import React from 'react';
import { Text, View } from 'react-native';
import ImageController, { ImageUploadProgressReport } from 'src/controller/image/ImageController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import { ImagesUploadingOverlay } from '../common/images/ImagesUploadingOverlay';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { Image } from 'resources/schema';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { useAppSelector } from 'src/redux/Hooks';
import { getTodaysPlannedDay } from 'src/redux/user/GlobalState';

export const TodaysPhotosWidget = () => {
    const { colors } = useTheme();

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
        const images = createImages(imageUrls);
        const plannedDayResult = await DailyResultController.getOrCreate(plannedDay);
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

    let carouselImages: ImageCarouselImage[] = [];
    images.forEach((image) => {
        if (!image.url || !image.active) {
            return;
        }

        carouselImages.push({
            url: image.url,
            format: 'png',
            type: 'image',
            onDelete: () => {
                deleteImage(image.url ?? '');
            },
        });
    });

    carouselImages.push({
        url: '',
        format: '',
        type: 'add_image',
        uploadImage: uploadImage,
    });

    const onImageUploadProgressReport = (progressReport: ImageUploadProgressReport) => {
        setImageUploadProgress(
            'uploading image ' + progressReport.completed + ' of ' + progressReport.total
        );
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
