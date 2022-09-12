import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { CarouselCardItem, CAROUSEL_IMAGE_HEIGHT } from './ImageCarouselItem';

export interface ImageCarouselImage {
    url: string;
    format: string;
}

interface Props {
    images: ImageCarouselImage[];
}
export const CarouselCards = ({ images }: Props) => {
    const isCarousel = React.useRef(null);

    return (
        <View style={{ alignItems: 'center' }}>
            <Carousel
                layout='stack'
                layoutCardOffset={20}
                ref={isCarousel}
                data={images}
                renderItem={CarouselCardItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={CAROUSEL_IMAGE_HEIGHT}
            />
        </View>
    );
};
