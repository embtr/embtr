import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Image, StyleProp, ImageStyle } from 'react-native';
import CacheManager from 'src/controller/image/ImageCacheController';

interface Props {
    uri: string;
    style?: StyleProp<ImageStyle> | undefined;
}

export const CachedImage = ({ uri, style }: Props) => {
    const [localUrl, setLocalUrl] = React.useState('');

    const getCachedImage = async (url: string) => {
        const localPath = await CacheManager.get(url, { md5: false }).getPath();
        if (localPath) {
            setLocalUrl(localPath);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            getCachedImage(uri);
        }, [uri])
    );

    if (!localUrl) {
        return <View style={style} />;
    }

    return <Image source={{ uri: localUrl }} style={style} />;
};
