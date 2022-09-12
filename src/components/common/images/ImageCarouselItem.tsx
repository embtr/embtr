import { Dimensions, Image, View } from 'react-native';
import { ImageCarouselImage } from './ImageCarousel';
interface Props {
    item: ImageCarouselImage;
    index: number;
}

export const CarouselCardItem = ({ item, index }: Props) => {
    return (
            <Image
                source={{ uri: item.url }}
                style={{
                    borderRadius: 15,
                    width: Dimensions.get('window').width * 0.9,
                    height: Dimensions.get('window').width * 0.9,
                }}
            />
    );
};
