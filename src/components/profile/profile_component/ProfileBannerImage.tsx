import { Image, View } from 'react-native';
import DEFAULT from 'assets/banner.png';
import { CachedImage } from 'src/components/common/images/CachedImage';
import Animated, { Easing, SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { getWindowWidth } from 'src/util/GeneralUtility';

interface Props {
    sourceUrl: string;
}

export default function ProfileBannerImage({ sourceUrl }: Props) {
    const width = getWindowWidth() * 0.95;
    const height = width / 3;

    return (
        <View style={{ width: '100%', alignItems: 'center' }}>
            {sourceUrl ? (
                <CachedImage style={{ width: '95%', height: '95%', borderRadius: 15 }} uri={sourceUrl} />
            ) : (
                <Image source={DEFAULT} style={{ width: width, height: height, maxHeight: 135, borderRadius: 15 }} />
            )}
        </View>
    );
}
