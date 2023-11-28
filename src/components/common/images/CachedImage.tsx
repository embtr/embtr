import { StyleProp, ImageStyle } from 'react-native';
import { Image } from 'expo-image';

interface CachedImageProps {
    uri: string;
    style?: StyleProp<ImageStyle> | undefined;
}

export const CachedImage = ({ uri, style }: CachedImageProps) => {
    return <Image source={uri} style={style} />;
};
