import { View, Text, Linking } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CarouselCards, ImageCarouselImage } from '../images/ImageCarousel';
import ParsedText from 'react-native-parsed-text';
import { Image } from 'resources/schema';

interface Props {
    title: string;
    post: string;
    images: Image[];
}

export const UserPostBody = ({ title, post, images }: Props) => {
    const { colors } = useTheme();

    let carouselImages: ImageCarouselImage[] = [];
    images.forEach((image) => {
        carouselImages.push({
            url: image.url!,
            format: 'png',
            type: 'image',
        });
    });

    return (
        <View style={{ paddingTop: 10 }}>
            <View style={{ paddingLeft: 15 }}>
                <Text style={{ fontFamily: 'Poppins_500Medium', fontSize: 16, color: colors.timeline_card_body }}>{title}</Text>
            </View>
            <View style={{ paddingTop: 10, paddingLeft: 15 }}>
                <ParsedText
                    parse={[{ type: 'url', style: { color: 'blue' }, onPress: (url) => Linking.openURL(url) }]}
                    style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.timeline_card_header }}
                >
                    {post}
                </ParsedText>
            </View>

            {carouselImages.length > 0 && (
                <View style={{ marginLeft: 10, marginRight: 10, overflow: 'hidden', paddingTop: 10, alignItems: 'center' }}>
                    <CarouselCards images={carouselImages} />
                </View>
            )}
        </View>
    );
};
