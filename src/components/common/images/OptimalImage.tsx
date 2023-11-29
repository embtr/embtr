import { Image, ImageStyle, StyleProp, View } from 'react-native';
import { LocalImageRepo } from './LocalImageRepo';
import { Image as ExpoImage } from 'expo-image';

export interface OptimalImageData {
    localImage?: string;
    remoteImageUrl?: string;
}

interface Props {
    data: OptimalImageData;
    style?: StyleProp<ImageStyle> | undefined;
}

export const OptimalImage = ({ data, style }: Props) => {
    if (data.localImage) {
        return <Image source={LocalImageRepo.get(data.localImage)} style={style} />;
    }

    if (data.remoteImageUrl) {
        return <ExpoImage source={{ uri: data.remoteImageUrl }} style={style} />;
    }

    return <View />;
};
