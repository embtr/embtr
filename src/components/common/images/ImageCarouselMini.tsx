import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { PADDING_LARGE } from 'src/util/constants';
import { CAROUSEL_IMAGE_HEIGHT, CarouselCardMiniItem } from './ImageCarouselMiniItem';
import { ImageCarouselImage } from './ImageCarousel';

interface Props {
    images: ImageCarouselImage[];
}

export const CarouselCardsMini = ({ images }: Props) => {
    const isCarousel = React.useRef<Carousel<ImageCarouselImage>>(null);

    return (
        <View
            style={{
                overflow: 'hidden',
                alignItems: 'flex-start',
                width: '100%',
            }}
        >
            <Carousel
                layout="default"
                ref={isCarousel}
                data={images}
                activeSlideAlignment="start"
                inactiveSlideScale={1}
                inactiveSlideOpacity={1}
                renderItem={CarouselCardMiniItem}
                sliderWidth={Dimensions.get('window').width}
                itemWidth={CAROUSEL_IMAGE_HEIGHT + PADDING_LARGE}
                vertical={false}
            />
        </View>
    );
};
