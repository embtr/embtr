import React from 'react';
import { Dimensions, View, TouchableOpacity, Text } from 'react-native';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CarouselCardItem, CAROUSEL_IMAGE_HEIGHT } from './ImageCarouselItem';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
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
    const { setScheme, isDark, colors } = useTheme();

    const isCarousel = React.useRef<Carousel<ImageCarouselImage>>(null);
    images[images.length - 1].isDarkTheme = isDark;

    const [activeSlide, setActiveSlide] = React.useState<number>(0);

    const renderArrow = (direction: 'left' | 'right') => {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (isCarousel.current) {
                        const newSlide = direction === 'left' ? activeSlide - 1 : activeSlide + 1;
                        isCarousel.current.snapToItem(newSlide);
                    }
                }}
                style={{ paddingHorizontal: TIMELINE_CARD_PADDING }}
            >
                <Text style={{ color: colors.secondary_text }}>
                    {direction === 'left' ? '<' : '>'}
                </Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ overflow: 'hidden', alignItems: 'center', height: CAROUSEL_IMAGE_HEIGHT }}>
            <Carousel
                layout="default"
                ref={isCarousel}
                data={images}
                inactiveSlideScale={1}
                renderItem={CarouselCardItem}
                sliderWidth={Dimensions.get('window').width * 0.9}
                itemWidth={CAROUSEL_IMAGE_HEIGHT}
                onSnapToItem={(index) => setActiveSlide(index)}
                vertical={false}
            />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: TIMELINE_CARD_PADDING*2,
                }}
            >
                {renderArrow('left')}
                <Pagination
                    dotsLength={images.length}
                    activeDotIndex={activeSlide}
                    containerStyle={{ backgroundColor: 'transparent', paddingVertical: 0 }}
                    dotStyle={{
                        width: TIMELINE_CARD_PADDING,
                        height: TIMELINE_CARD_PADDING,
                        borderRadius: 5,
                        marginHorizontal: 8,
                        backgroundColor: 'rgba(255, 255, 255, 0.92)',
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.6}
                />
                {renderArrow('right')}
            </View>
        </View>
    );
};
