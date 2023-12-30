import { ca } from 'date-fns/locale';
import { Image } from 'resources/schema';
import { ImageCarouselImage } from 'src/components/common/images/ImageCarousel';

export class ImageUtility {
    public static createReadOnlyCarouselImages(images: Image[]) {
        let carouselImages: ImageCarouselImage[] = [];
        images.forEach((image) => {
            if (!image.url || !image.active) {
                return;
            }

            carouselImages.push({
                url: image.url,
                format: 'png',
                type: 'image',
            });
        });

        return carouselImages;
    }

    public static createUpdatableCarouselImages(
        images: Image[],
        uploadImage: Function,
        deleteImage?: Function
    ) {
        let carouselImages: ImageCarouselImage[] = [];
        images.forEach((image) => {
            if (!image.url || image.active === false) {
                return;
            }

            carouselImages.push({
                url: image.url,
                format: 'png',
                type: 'image',
                onDelete: () => {
                    if (!deleteImage) {
                        return;
                    }

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

        return carouselImages;
    }
}
