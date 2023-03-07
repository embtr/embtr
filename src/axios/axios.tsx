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
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            getAuth().signOut();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
