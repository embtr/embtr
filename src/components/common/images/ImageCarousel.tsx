import React from 'react';
import { Dimensions, View } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CarouselCardItem, CAROUSEL_IMAGE_HEIGHT } from './ImageCarouselItem';
import { PADDING_LARGE } from 'src/util/constants';
export interface ImageCarouselImage {
    url: string;
    format: string;
    type?: string;
    uploadImage?: Function;
    onPress?: Function;
    onDelete?: Function;
    isDarkTheme?: boolean;
}

const PAGINATION_DOT_SIZE = PADDING_LARGE * 0.5;

interface Props {
    images: ImageCarouselImage[];
}

export const CarouselCards = ({ images }: Props) => {
    const { setScheme, isDark, colors } = useTheme();

    const isCarousel = React.useRef<Carousel<ImageCarouselImage>>(null);
    images[images.length - 1].isDarkTheme = isDark;

    const [activeSlide, setActiveSlide] = React.useState<number>(0);

    return (
        <View
            style={{
                overflow: 'hidden',
                alignItems: 'center',
                height: CAROUSEL_IMAGE_HEIGHT + PAGINATION_DOT_SIZE + PADDING_LARGE,
            }}
        >
            <Carousel
                layout="default"
                ref={isCarousel}
                data={images}
                inactiveSlideScale={1}
                renderItem={CarouselCardItem}
                sliderWidth={CAROUSEL_IMAGE_HEIGHT}
                itemWidth={CAROUSEL_IMAGE_HEIGHT}
                onScrollIndexChanged={(index) => setActiveSlide(index)}
                vertical={false}
            />

            <Pagination
                dotsLength={images.length}
                activeDotIndex={activeSlide}
                containerStyle={{
                    backgroundColor: 'transparent',
                    paddingTop: 0,
                    paddingBottom: 0,
                }}
                dotStyle={{
                    width: PAGINATION_DOT_SIZE,
                    height: PAGINATION_DOT_SIZE,
                    borderRadius: 50,
                    backgroundColor: colors.accent_color,
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={1}
            />
        </View>
    );
};
