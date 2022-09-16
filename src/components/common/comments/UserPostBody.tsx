import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CarouselCards, ImageCarouselImage } from '../images/ImageCarousel';

interface Props {
    title: string;
    post: string;
    images: string[];
}

export const UserPostBody = ({ title, post, images }: Props) => {
    const { colors } = useTheme();

    let carouselImages: ImageCarouselImage[] = [];
    images.forEach((image) => {
        carouselImages.push({
            url: image,
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
                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, color: colors.timeline_card_header }}>{post}</Text>
            </View>
            <View style={{ marginLeft: 10, marginRight: 10, overflow: 'hidden', paddingTop: 10, alignItems: 'center' }}>
                <CarouselCards images={carouselImages} />
            </View>
        </View>
    );
};
