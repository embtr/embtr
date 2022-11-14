import { useState } from 'react';
import { Image, View } from 'react-native';
import DEFAULT from 'assets/banner.png';
import { CachedImage } from 'src/components/common/images/CachedImage';
import Animated, { Easing, SharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { getWindowWidth } from 'src/util/GeneralUtility';

interface Props {
    sourceUrl?: string;
    animatedBannerRatio: SharedValue<number>;
}

export default function ProfileBannerImage({ sourceUrl, animatedBannerRatio }: Props) {
    const width = getWindowWidth() * 0.95;
    const height = width / 3;

    const style = useAnimatedStyle(() => {
        return {
            height: withTiming(height * animatedBannerRatio.value, {
                duration: 300,
                easing: Easing.bezier(0.25, 0, 0.25, 1),
            }),
            width: withTiming(width * animatedBannerRatio.value, {
                duration: 300,
                easing: Easing.bezier(0.25, 0, 0.25, 1),
            }),
        };
    });

    return (
        <View style={{ width: '100%', alignItems: 'center' }}>
            <Animated.View style={style}>
                {sourceUrl ? (
                    <CachedImage style={{ width: '100%', height: '100%', borderRadius: 15 }} uri={sourceUrl} />
                ) : (
                    <Image source={DEFAULT} style={{ width: width, height: height, maxHeight: 135, borderRadius: 15 }} />
                )}
            </Animated.View>
        </View>
    );
}
