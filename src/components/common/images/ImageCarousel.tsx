import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CarouselCardItem, CAROUSEL_IMAGE_HEIGHT } from './ImageCarouselItem';

export interface ImageCarouselImage {
    url: string;
    format: string;
    type?: string;
    uploadImage?: Function;
    onPress?: Function;
    onDelete?: Function;
    isDarkTheme?: boolean;
}

interface Props {
    images: ImageCarouselImage[];
}

export const CarouselCards = ({ images }: Props) => {
    const { setScheme, isDark } = useTheme();

    const isCarousel = React.useRef<Carousel<ImageCarouselImage>>(null);
    images[images.length - 1].isDarkTheme = isDark;

    return (
        <View
            style={{ overflow: 'hidden', alignItems: 'center', height: CAROUSEL_IMAGE_HEIGHT + 5 }}
        >
            <Carousel
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
