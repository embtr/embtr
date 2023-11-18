import { StyleProp, ImageStyle } from 'react-native';
import { isDesktopBrowser, isMobileBrowser } from 'src/util/DeviceUtil';
import { Image } from 'expo-image';

interface Props {
    uri: string;
    style?: StyleProp<ImageStyle> | undefined;
}

export const CachedImage = ({ uri, style }: Props) => {
    if (isDesktopBrowser() || isMobileBrowser()) {
        return <Image source={{ uri }} style={style} />;
    }

    return <Image source={uri} style={style} />;
};
