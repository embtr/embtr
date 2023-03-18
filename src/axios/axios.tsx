import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { getApiUrl } from 'src/util/UrlUtility';
import { getAuthTokenId } from 'src/util/user/CurrentUserUtil';

const axiosInstance = axios.create({
    baseURL: getApiUrl(),
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const authToken = await getAuthTokenId();
        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => {
        if (response.data) {
            response.data = parseDates(response.data);
        }
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            getAuth().signOut();
        }
        return Promise.reject(error);
    }
);

function parseDates<T>(data: T): T {
    if (Array.isArray(data)) {
        return data.map((item) => parseDates(item)) as any;
    } else if (typeof data === 'object' && data !== null) {
        for (const key in data) {
            if (typeof data[key] === 'string' && isDateString(data[key])) {
                (data as any)[key] = new Date(data[key] as string) as any;
            } else {
                (data as any)[key] = parseDates((data as any)[key]) as any;
            }
        }
    }
    return data;
}

function isDateString(value: any): boolean {
    // Use a regular expression to check if the string matches the format of a date string
    const dateRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2}))?$/;
    return dateRegex.test(value);
}

export default axiosInstance;
