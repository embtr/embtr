import React from 'react';
import { Text, View } from 'react-native';
import { ImageUploadProgressReport } from 'src/controller/image/ImageController';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import { ImagesUploadingOverlay } from '../common/images/ImagesUploadingOverlay';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';

interface Props {
    dailyResult: DailyResultModel;
    plannedDay: PlannedDay;
    onImagesChanged: Function;
}

export const TodaysPhotosWidget = ({ dailyResult, plannedDay, onImagesChanged }: Props) => {
    const { colors } = useTheme();

    const [imagesUploading, setImagesUploading] = React.useState(false);
    const [imageUploadProgess, setImageUploadProgress] = React.useState('');

    const savePhotos = async (photoUrls: string[]) => {
        if (dailyResult) {
            let clonedDailyResult = DailyResultController.clone(dailyResult);
            clonedDailyResult.data.imageUrls = photoUrls;
            if (!clonedDailyResult.data.description) {
                clonedDailyResult.data.description = '';
            }
            await DailyResultController.update(clonedDailyResult);
            onImagesChanged();
        }
    };

    const onImageUploadProgressReport = (progressReport: ImageUploadProgressReport) => {
        setImageUploadProgress('uploading image ' + progressReport.completed + ' of ' + progressReport.total);
    };

    const onUploadImage = async () => {
        setImagesUploading(true);
        setImageUploadProgress('preparing photo upload');

        const newImageUrls = await DailyResultController.uploadImages(onImageUploadProgressReport);
        let updatedImageUrls = [...(dailyResult.data.imageUrls ? dailyResult.data.imageUrls : [])];
        updatedImageUrls = updatedImageUrls.concat(newImageUrls);

        savePhotos(updatedImageUrls);

        setImageUploadProgress('');
        setImagesUploading(false);
    };

    const onDeleteImage = (deletedImageUrl: string) => {
        let imageUrls: string[] = [];
        dailyResult.data.imageUrls?.forEach((imageUrl) => {
            if (imageUrl !== deletedImageUrl) {
                imageUrls.push(imageUrl);
            }
        });

        savePhotos(imageUrls);
    };

    let carouselImages: ImageCarouselImage[] = [];

    dailyResult.data.imageUrls?.forEach((image) => {
        carouselImages.push({
            url: image,
            format: 'png',
            type: 'image',
            onDelete: onDeleteImage,
        });
    });

    carouselImages.push({
        url: '',
        format: '',
        type: 'add_image',
        uploadImage: onUploadImage,
    });

    return (
        <WidgetBase>
            <ImagesUploadingOverlay active={imagesUploading} progress={imageUploadProgess} />
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Photos</Text>
            <View style={{ paddingTop: 10 }}>
                <CarouselCards images={carouselImages} />
            </View>
        </WidgetBase>
    );
};
