import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { CarouselCardItem, CAROUSEL_IMAGE_HEIGHT } from './ImageCarouselItem';

export interface ImageCarouselImage {
    url: string;
    format: string;
    type?: string;
    uploadImage?: Function;
    onPress?: Function;
    onDelete?: Function;
}

interface Props {
    images: ImageCarouselImage[];
}

export const CarouselCards = ({ images }: Props) => {
    const isCarousel = React.useRef(null);
    const [loadedImages, setLoadedImages] = React.useState<ImageCarouselImage[]>([]);

    const wait = (timeout: number | undefined) => {
        return new Promise((resolve) => setTimeout(resolve, timeout));
    };

    React.useEffect(() => {
        setLoadedImages([]);
        wait(100).then(() => {
            setLoadedImages(images);
        });
    }, [images]);

    return (
        <View style={{ overflow: 'hidden', alignItems: 'center', height: CAROUSEL_IMAGE_HEIGHT + 5 }}>
            <Carousel
                firstItem={images.length > 0 && images[0]?.type === 'add_image' ? 1 : 0}
                layout="default"
                ref={isCarousel}
                data={loadedImages}
                inactiveSlideScale={1}
                renderItem={CarouselCardItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={CAROUSEL_IMAGE_HEIGHT + 5}
            />
        </View>
    );
};
