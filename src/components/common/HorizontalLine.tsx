import * as React from 'react';
import { ColorValue, StyleSheet, View } from "react-native"

interface Props {
    color? : ColorValue
}

export const HorizontalLine = ( { color } : Props ) => {

    return <View
        style={{
            borderBottomColor: color ? color : "#808080",
            borderBottomWidth: StyleSheet.hairlineWidth,
        }}
    />
}
