import axios from 'axios';
import { getAuth } from 'firebase/auth';
import { Code } from 'resources/codes';
import { hydrateDates } from 'src/util/DateUtility';
import { getApiUrl } from 'src/util/UrlUtility';
import { getAuthTokenId } from 'src/util/user/CurrentUserUtil';
import Constants from 'expo-constants';
import { getTodayKey } from 'src/controller/planning/PlannedDayController';

const axiosInstance = axios.create({
    baseURL: getApiUrl(),
});

const currentVersion = Constants.expoConfig?.version;

axiosInstance.interceptors.request.use(
    async (config) => {
        const dayKey = getTodayKey();
        const authToken = await getAuthTokenId();
        const currentTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        if (authToken) {
            config.headers['Authorization'] = `Bearer ${authToken}`;
        }

        config.headers['client-version'] = currentVersion;
        config.headers['client-dayKey'] = dayKey;
        config.headers['client-timeZone'] = currentTimeZone;

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
