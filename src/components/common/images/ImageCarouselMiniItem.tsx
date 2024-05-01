import { Dimensions, View } from 'react-native';
import { ImageCarouselImage } from './ImageCarousel';
import { Ionicons } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';
import { CachedImage } from './CachedImage';
import { PADDING_LARGE } from 'src/util/constants';

interface Props {
    item: ImageCarouselImage;
    index: number;
}

export const CAROUSEL_IMAGE_HEIGHT = Dimensions.get('window').width * 0.3;

export const CarouselCardMiniItem = ({ item }: Props) => {
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
                            borderRadius: 25,
                            marginTop: CAROUSEL_IMAGE_HEIGHT * 0.01,
                            marginRight: CAROUSEL_IMAGE_HEIGHT * 0.01,
                            right: PADDING_LARGE,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                position: 'absolute',
                                zIndex: -1,
                                height: 10,
                                width: 10,
                                backgroundColor: 'black',
                            }}
                        />

                        <TouchableWithoutFeedback
                            onPress={() => {
                                item.onDelete!(item.url);
                            }}
                        >
                            <Ionicons name={'close-circle'} size={20} color={'white'} />
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
