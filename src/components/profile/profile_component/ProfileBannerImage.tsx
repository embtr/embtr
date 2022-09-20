import React, { useState } from 'react';
import { Image, View } from 'react-native';
import DEFAULT from 'assets/banner.png';
import { CachedImage } from 'src/components/common/images/CachedImage';

interface Props {
    sourceUrl?: string;
    ratio?: number;
}

export default function ProfileBannerImage({ sourceUrl, ratio }: Props) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    return (
        <View
            style={{ width: '100%', alignItems: 'center' }}
            onLayout={(e) => {
                const screenWidth = e.nativeEvent.layout.width;
                const imageWidth = screenWidth * 0.95;
                const imageHeight = imageWidth / 3;

                setWidth(imageWidth);
                setHeight(imageHeight);
            }}
        >
            {sourceUrl ? (
                <CachedImage style={{ width: width, height: height, maxHeight: 135, borderRadius: 15 }} uri={sourceUrl} />
            ) : (
                <Image source={DEFAULT} style={{ width: width, height: height, maxHeight: 135, borderRadius: 15 }} />
            )}
        </View>
    );
}
