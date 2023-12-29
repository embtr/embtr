import { Timestamp } from 'firebase/firestore';
import { deleteUser, getAuth } from 'firebase/auth';
import axiosInstance from 'src/axios/axios';
import {
    CreateAccountRequest,
    ForgotAccountPasswordRequest,
    VerifyAccountEmailRequest,
} from 'resources/types/requests/AccountTypes';
import {
    GetUserResponse,
    GetUsersResponse,
    UpdateUserRequest,
    UpdateUserResponse,
} from 'resources/types/requests/UserTypes';
import { Response } from 'resources/types/requests/RequestTypes';
import { USER } from 'resources/endpoints';
import { ImagePickerResult } from 'expo-image-picker';
import { pickImage } from 'src/util/ImagePickerUtil';
import { uploadImage } from 'src/firebase/cloud_storage/profiles/ProfileCsp';
import { User } from 'resources/schema';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { getCurrentUser } from 'src/redux/user/GlobalState';

export interface UserModel {
    uid: string;
    access_level: string;
    email: string;
    post_notification_token?: string;
    today_widgets?: string[];
    timestamp: Timestamp;
}

export const FAKE_USER: UserModel = {
    uid: '',
    access_level: '',
    email: '',
    post_notification_token: '',
    timestamp: Timestamp.now(),
};

const ACCOUNT_ENDPOINT = 'account';
const USER_ENDPOINT = 'user';

class UserController {
    public static async createAccount(email: string, password: string): Promise<Response> {
        const body: CreateAccountRequest = {
            email,
            password,
        };

        return await axiosInstance
            .post(`/${ACCOUNT_ENDPOINT}/create/`, body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async forgotPassword(email: string): Promise<Response> {
        const body: ForgotAccountPasswordRequest = {
            email,
        };

        return await axiosInstance
            .post(`/${ACCOUNT_ENDPOINT}/forgot_password/`, body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async sendVerifyEmail(email: string): Promise<Response> {
        const body: VerifyAccountEmailRequest = {
            email,
        };

        return await axiosInstance
            .post(`/${ACCOUNT_ENDPOINT}/send_verification_email`, body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async getCurrentUser() {
        return await axiosInstance
            .get(`/${USER_ENDPOINT}`)
            .then((success) => {
                const data: GetUserResponse = success.data;
                return data.user;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async getUserByUidViaApi(uid: string): Promise<GetUserResponse> {
        return await axiosInstance
            .get(`/${USER_ENDPOINT}/${uid}`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async createUser() {
        return await axiosInstance
            .post(`/${USER_ENDPOINT}/`)
            .then(async (success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async deleteUser() {
        await axiosInstance
            .post(`/${ACCOUNT_ENDPOINT}/delete`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async setup(
        request: UpdateUserRequest
    ): Promise<UpdateUserResponse | undefined> {
        return await axiosInstance
            .patch(`${USER}setup`, request)
            .then((success) => {
                const data: UpdateUserResponse = success.data;
                return data;
            })
            .catch((error) => {
                return undefined;
            });
    }


    public static async update(
        request: UpdateUserRequest
    ): Promise<UpdateUserResponse | undefined> {
        return await axiosInstance
            .patch(`${USER}`, request)
            .then((success) => {
                const data: UpdateUserResponse = success.data;
                return data;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async search(query: string) {
        return await axiosInstance
            .get(`/${USER_ENDPOINT}/search`, { params: { query } })
            .then((success) => {
                const usersResponse: GetUsersResponse = success.data;
                return usersResponse.users;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async refreshToken() {
        return await axiosInstance
            .post(`/${ACCOUNT_ENDPOINT}/refresh_token`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async loginUser(): Promise<User | undefined> {
        let userResponse: GetUserResponse = await this.getCurrentUser();
        if (userResponse.success && userResponse.user) {
            return userResponse.user;
        }

        const result = await this.createUser();
        if (result.success) {
            await this.forceRefreshIdToken();

            userResponse = await this.getCurrentUser();
            if (userResponse.success && userResponse.user) {
                return userResponse.user;
            }
        }

        return undefined;
    }

    public static async logoutUser() {
        await getAuth().signOut();
    }

    private static async forceRefreshIdToken() {
        const refreshedTOken = await getAuth().currentUser?.getIdToken(true);
    }

    public static async uploadProfilePhoto(): Promise<string | undefined> {
        const result: ImagePickerResult = await pickImage();

        if (result && !result.canceled && result.assets.length > 0) {
            const selectedImage = result.assets[0];
            const uploadUrl = await uploadImage(selectedImage, 'profiles/');
            return uploadUrl;
        }

        return undefined;
    }

    public static async uploadProfileBanner(): Promise<string | undefined> {
        const result: ImagePickerResult = await pickImage();

        if (result && !result.canceled && result.assets.length > 0) {
            const selectedImage = result.assets[0];
            const uploadUrl = await uploadImage(selectedImage, 'profiles/');
            return uploadUrl;
        }

        return undefined;
    }
}

export namespace UserCustomHooks {
    export const useCurrentUser = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['currentUser'],
            queryFn: () => UserController.getCurrentUser(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useCurrentUserId = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['currentUserId'],
            queryFn: () => getUserIdFromToken(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}

export default UserController;
