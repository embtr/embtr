import { Dimensions, Image, View } from 'react-native';
import { ImageCarouselImage } from './ImageCarousel';
interface Props {
    item: ImageCarouselImage;
    index: number;
}

export const CAROUSEL_IMAGE_HEIGHT = Dimensions.get('window').width * 0.6;

export const CarouselCardItem = ({ item, index }: Props) => {
    return (
        <Image
            source={{ uri: item.url }}
            style={{
                borderRadius: 15,
                width: CAROUSEL_IMAGE_HEIGHT,
                height: CAROUSEL_IMAGE_HEIGHT,
            }}
        />
    );
};
