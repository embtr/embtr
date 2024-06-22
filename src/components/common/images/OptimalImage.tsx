import { Image, ImageStyle, StyleProp, View } from 'react-native';
import { LocalImageRepo } from './LocalImageRepo';
import { Image as ExpoImage } from 'expo-image';
import { isIosApp } from 'src/util/DeviceUtil';
import { Ionicons } from '@expo/vector-icons';
import { Icon } from 'resources/schema';

export interface OptimalImageData {
    icon?: Icon;
    localImage?: string;
    remoteImageUrl?: string;
    ionicon?: {
        name: string;
        color: string;
    };
}

interface Props {
    data: OptimalImageData;
    style?: StyleProp<ImageStyle> | undefined;
}

export const OptimalImage = ({ data, style }: Props) => {
    if (data.icon) {
        return (
            <OptimalImage
                data={{
                    remoteImageUrl: data.icon.remoteImageUrl,
                    localImage: data.icon.localImage,
                }}
                style={style}
            />
        );
    }

    if (data.localImage) {
        const source = LocalImageRepo.get(data.localImage);
        if (source) {
            if (isIosApp()) {
                return <ExpoImage source={LocalImageRepo.get(data.localImage)} style={style} />;
            } else {
                return <Image source={LocalImageRepo.get(data.localImage)} style={style} />;
            }
        }
    }

    if (data.remoteImageUrl) {
        return <ExpoImage source={{ uri: data.remoteImageUrl }} style={style} />;
    }

    if (data.ionicon) {
        // @ts-ignore
        const height = style?.height ?? 0;

        return (
            <Ionicons size={height} color={data.ionicon.color} name={data.ionicon.name as any} />
        );
    }

    return <View />;
};
