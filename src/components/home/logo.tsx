import * as React from 'react';
import { Image } from 'react-native'

export const Logo = () => {
    return (
        <Image source={require('../../../src/assets/logo.png')} style={{ width: 200, height: 200 }} />
    );
}