import Constants from 'expo-constants';

export const getApiUrl = (path: string) => {
    const apiUrl = Constants.expoConfig?.extra?.apiUrl;
    const url = `${apiUrl}${path}`;

    return url;
};
