import React from 'react';
import { Text, View } from 'react-native';
import { ImageUploadProgressReport } from 'src/controller/image/ImageController';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import DailyResultController, { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import { ImagesUploadingOverlay } from '../common/images/ImagesUploadingOverlay';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
    dailyResult: DailyResultModel;
    plannedDay: PlannedDay;
}

export const TodaysPhotosWidget = ({ dailyResult, plannedDay }: Props) => {
    const { colors } = useTheme();

    const [imagesUploading, setImagesUploading] = React.useState(false);
    const [imageUploadProgess, setImageUploadProgress] = React.useState('');
    const [updatedImageUrls, setUpdatedImageUrls] = React.useState<string[]>(dailyResult?.data?.imageUrls ? dailyResult.data.imageUrls : []);

    React.useEffect(() => {
        savePhotos();
    }, [updatedImageUrls]);

    const savePhotos = () => {
        if (dailyResult) {
            let clonedDailyResult = DailyResultController.clone(dailyResult);
            clonedDailyResult.data.imageUrls = updatedImageUrls;
            if (!clonedDailyResult.data.description) {
                clonedDailyResult.data.description = '';
            }
            DailyResultController.update(clonedDailyResult);
        }
    };

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

    return (
        <View style={{ paddingLeft: 5, paddingRight: 5, paddingTop: 5 }}>
            <ImagesUploadingOverlay active={imagesUploading} progress={imageUploadProgess} />
            <View
                style={{
                    borderRadius: 15,
                    backgroundColor: colors.timeline_card_background,
                    paddingTop: 10,
                    paddingBottom: 10,
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
            >
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Photos</Text>
                <View style={{ paddingTop: 10 }}>
                    <CarouselCards images={carouselImages} />
                </View>
            </View>
        </View>
    );
};
