import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { CarouselCardItem, CAROUSEL_IMAGE_HEIGHT } from './ImageCarouselItem';

export interface ImageCarouselImage {
    url: string;
    format: string;
    type?: string;
    uploadImage?: Function;
}

interface Props {
    images: ImageCarouselImage[];
}
export const CarouselCards = ({ images }: Props) => {
    const isCarousel = React.useRef(null);

    return (
        <View style={{ alignItems: 'center', height: Dimensions.get('window').width - 100 }}>
            <Carousel
                firstItem={images.length > 0 ? 1 : 0}
                layout="default"
                ref={isCarousel}
                data={images}
                inactiveSlideScale={1}
                renderItem={CarouselCardItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={CAROUSEL_IMAGE_HEIGHT + 5}
            />
        </View>
    );
};
