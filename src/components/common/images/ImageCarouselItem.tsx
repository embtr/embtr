import { Dimensions, Image, View, Text } from 'react-native';
import { ImageCarouselImage } from './ImageCarousel';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
    item: ImageCarouselImage;
    index: number;
}

export const CAROUSEL_IMAGE_HEIGHT = Dimensions.get('window').width * 0.6;

export const CarouselCardItem = ({ item, index }: Props) => {
    if (item.type === 'add_image') {
        return (
            <TouchableOpacity
                onPress={() => {
                    if (item.uploadImage) {
                        item.uploadImage();
                    }
                }}
            >
                <View
                    style={{
                        height: CAROUSEL_IMAGE_HEIGHT,
                        width: CAROUSEL_IMAGE_HEIGHT,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: 'black',
                        borderWidth: 1,
                        borderRadius: 5,
                        borderStyle: 'dashed',
                    }}
                >
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13 }}>add images</Text>
                    <Ionicons name={'image-outline'} size={40} color={'black'} />
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <Image
            source={{ uri: item.url }}
            style={{
                borderRadius: 5,
                width: CAROUSEL_IMAGE_HEIGHT,
                height: CAROUSEL_IMAGE_HEIGHT,
            }}
        />
    );
};
