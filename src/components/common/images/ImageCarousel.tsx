import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { CarouselCardItem } from './ImageCarouselItem';

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
                ref={isCarousel}
                data={images}
                renderItem={CarouselCardItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={Dimensions.get('window').width * 0.90}
            />
        </View>
    );
};
