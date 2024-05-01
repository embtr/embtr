import React from 'react';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { ImageCarouselImage } from '../common/images/ImageCarousel';
import { ImageUtility } from 'src/util/images/ImageUtility';
import { Image } from 'resources/schema';
import { ImagesUploadingOverlay } from '../common/images/ImagesUploadingOverlay';
import { ImageUploadProgressReport } from 'src/controller/image/ImageController';

interface Props {
    uploadImage: () => void;
}

export const CreateEditImages = () => {
    const [imagesUploading, setImagesUploading] = React.useState(false);
    const [imageUploadProgess, setImageUploadProgress] = React.useState('');

    const [updatedImageUrls, setUpdatedImageUrls] = React.useState<Image[]>([]);
    const [carouselImages, setCarouselImages] = React.useState<ImageCarouselImage[]>([]);

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
        let newCarouselImages: ImageCarouselImage[] = ImageUtility.createDeleteOnlyCarouselImages(
            updatedImageUrls,
            onDeleteImage
        );
        setCarouselImages(newCarouselImages);
    }, [updatedImageUrls]);

    const onImageUploadProgressReport = (progressReport: ImageUploadProgressReport) => {
        setImageUploadProgress(
            'uploading image ' + progressReport.completed + ' of ' + progressReport.total
        );
    };

    const onDeleteImage = (deletedImageUrl: string) => {
        let updatedImages: Image[] = updatedImageUrls.map((image) => {
            if (image.url === deletedImageUrl) {
                image.active = false;
            }

            return { ...image };
        });

        setUpdatedImageUrls(updatedImages);
    };

    return <ImagesUploadingOverlay active={imagesUploading} progress={imageUploadProgess} />;
};
