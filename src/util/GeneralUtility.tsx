import { Dimensions, View } from 'react-native';
import { TIMELINE_CARD_PADDING } from './constants';

export const wait = (timeout: number | undefined) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const getWindowWidth = () => {
    const width = Dimensions.get('window').width;
    return width;
};

export const getSafeWindowWidth = () => {
    const windowWidth = getWindowWidth();
    return windowWidth - TIMELINE_CARD_PADDING * 2;
};

export const getWindowHeight = () => {
    const height = Dimensions.get('window').height;
    return height;
};

export const getRandomInt = (min: number, max: number) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const shouldUseNarrowView = () => {
    return getWindowWidth() < 500;
};

export const getOptional = (optional?: string): string => {
    let result = '';
    if (optional) {
        result = optional;
    }

    return result;
};

export const getVerticalAlignmentLine = () => {
    return (
        <View
            style={{
                flexDirection: 'row',
                width: 1,
                height: '100%',
                position: 'absolute',
                zIndex: 1223,
                backgroundColor: 'yellow',
                alignSelf: 'center',
            }}
        />
    );
};