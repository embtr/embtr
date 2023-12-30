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
                onScrollIndexChanged={(index) => setActiveSlide(index)}
                vertical={false}
            />
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingHorizontal: TIMELINE_CARD_PADDING*2,
                }}
            >
                <Pagination
                    dotsLength={images.length}
                    activeDotIndex={activeSlide}
                    containerStyle={{ backgroundColor: 'transparent', paddingVertical: TIMELINE_CARD_PADDING / 2 }}
                    dotStyle={{
                        width: TIMELINE_CARD_PADDING * .3,
                        height: TIMELINE_CARD_PADDING * .3,
                        borderRadius: 50,
                        marginHorizontal: TIMELINE_CARD_PADDING / 6,
                        backgroundColor: colors.accent_color_light
                    }}
                    inactiveDotOpacity={0.4}
                    inactiveDotScale={0.85}
                />
            </View>
        </View>
    );
};
