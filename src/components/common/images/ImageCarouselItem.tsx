import { Dimensions, View, Text } from 'react-native';
import { ImageCarouselImage } from './ImageCarousel';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { CachedImage } from './CachedImage';

interface Props {
    item: ImageCarouselImage;
    index: number;
}

export const CAROUSEL_IMAGE_HEIGHT = Dimensions.get('window').width * 0.9;

export const CarouselCardItem = ({ item }: Props) => {
    const color = item.isDarkTheme === true ? 'white' : 'black';

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
                        height: CAROUSEL_IMAGE_HEIGHT * 0.92,
                        width: CAROUSEL_IMAGE_HEIGHT,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: color,
                        borderWidth: 1,
                        borderRadius: 5,
                        borderStyle: 'dashed',
                    }}
                >
                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 13, color: color }}>
                        add photos
                    </Text>
                    <Ionicons name={'image-outline'} size={40} color={color} />
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableWithoutFeedback
            key={item.url}
            onPress={
                item.onPress
                    ? () => {
                          item.onPress!();
                      }
                    : undefined
            }
        >
            <View>
                {item.onDelete && (
                    <View
                        style={{
                            position: 'absolute',
                            zIndex: 1,
                            height: CAROUSEL_IMAGE_HEIGHT / 8,
                            width: CAROUSEL_IMAGE_HEIGHT / 8,
                            backgroundColor: 'rgba(0,0,0,0.65)',
                            marginTop: 5,
                            left: CAROUSEL_IMAGE_HEIGHT - CAROUSEL_IMAGE_HEIGHT / 8 - 5,
                            borderRadius: 5,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <TouchableWithoutFeedback
                            onPress={() => {
                                item.onDelete!(item.url);
                            }}
                        >
                            <Ionicons name={'trash-outline'} size={20} color={'white'} />
                        </TouchableWithoutFeedback>
                    </View>
                )}
                <CachedImage
                    uri={item.url}
                    style={{
                        borderRadius: 5,
                        width: CAROUSEL_IMAGE_HEIGHT,
                        height: CAROUSEL_IMAGE_HEIGHT,
                    }}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};
