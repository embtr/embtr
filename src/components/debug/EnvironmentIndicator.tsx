import { View } from 'react-native';
import React from 'react';
import { isIosApp } from 'src/util/DeviceUtil';

export const EnvironmentIndicator = () => {
    return process.env.EXPO_PUBLIC_ENV === 'development' ? (
        <View
            style={{
                height: 5,
                width: 5,
                borderRadius: 10,
                backgroundColor: 'yellow',
                position: 'absolute',
                zIndex: 1000,
                top: isIosApp() ? 45 : 0,
                right: isIosApp() ? 5 : 2.5,
            }}
        />
    ) : (
        <View />
    );
};
