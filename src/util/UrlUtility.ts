import Constants from 'expo-constants';

export const getApiUrl = () => {
    const apiUrl = Constants.expoConfig?.extra?.apiUrl;
    return apiUrl;
};
