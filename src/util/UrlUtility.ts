import Constants from 'expo-constants';

export const getApiUrl = (path: string) => {
    const apiUrl = Constants.expoConfig?.extra?.apiUrl;
    return `${apiUrl}${path}`;
};
