import { Image, ImageStyle, StyleProp, View } from 'react-native';
import { LocalImageRepo } from './LocalImageRepo';
import { Image as ExpoImage } from 'expo-image';
import { isIosApp } from 'src/util/DeviceUtil';

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
        if (isIosApp()) {
            return <ExpoImage source={LocalImageRepo.get(data.localImage)} style={style} />;
        } else {
            return <Image source={LocalImageRepo.get(data.localImage)} style={style} />;
        }
    }

    if (data.remoteImageUrl) {
        return <ExpoImage source={{ uri: data.remoteImageUrl }} style={style} />;
    }

    return <View />;
};
