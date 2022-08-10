import React, { useCallback, useState } from "react";
import { Dimensions, Image, View } from "react-native";

interface Props {
    sourceUrl: string,
    ratio?: number
}

export default function FullWidthImage({ sourceUrl, ratio }: Props) {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);

    const source = require(sourceUrl);

    return (
        <View style={{ width: "100%", height: "100%", alignItems: "center" }}
            onLayout={(e) => {
                const screenWidth = e.nativeEvent.layout.width;
                const imageWidth = screenWidth * .95;
                const imageHeight = imageWidth / 3;

                setWidth(imageWidth);
                setHeight(imageHeight);
            }}>
            <Image
            source={{ uri: sourceUrl }}
                style={{ width: width, height: height, maxHeight: 135, borderRadius: 15}} />
        </View>
    );
}