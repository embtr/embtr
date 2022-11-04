import { Dimensions } from 'react-native';

export const wait = (timeout: number | undefined) => {
    return new Promise((resolve) => setTimeout(resolve, timeout));
};

export const getDaysOld = (then: any, now: any): number => {
    const dateDiff = now - then;

    const daysOld = dateDiff / (1000 * 60 * 60 * 24);
    if (daysOld < 1) {
        return 0;
    }

    return Math.round(daysOld);
};

export const getWindowWidth = () => {
    const width = Dimensions.get('window').width;
    return width;
};
