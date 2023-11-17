import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Image, StyleProp, ImageStyle } from 'react-native';
import CacheManager from 'src/controller/image/ImageCacheController';
import { isDesktopBrowser, isMobileBrowser } from 'src/util/DeviceUtil';
import { SvgUri } from 'react-native-svg';

interface Props {
    uri: string;
    height: number;
    width: number;
    style?: StyleProp<ImageStyle> | undefined;
}

export const CachedSvg = ({ uri, height, width, style }: Props) => {
    if (isDesktopBrowser() || isMobileBrowser()) {
        return <Image source={{ uri }} style={style} />;
    }

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

    return <SvgUri width={width} height={height} uri={uri} />;
};
