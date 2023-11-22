import { StyleProp, ImageStyle } from 'react-native';
import { Image } from 'expo-image';

interface Props {
    uri: string;
    style?: StyleProp<ImageStyle> | undefined;
}

export const CachedImage = ({ uri, style }: Props) => {
    return <Image source={uri} style={style} />;
};
