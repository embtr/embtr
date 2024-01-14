import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { Code } from 'resources/codes';
import { hydrateDates } from 'src/util/DateUtility';
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
            response.data = hydrateDates(response.data);
        }
        return response;
    },
    (error) => {
        if (error.response.internalCode === Code.REAUTHENTICATE) {
            getAuth().signOut();
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
