import { Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axiosInstance from 'src/axios/axios';
import {
    CreateAccountRequest,
    ForgotAccountPasswordRequest,
    VerifyAccountEmailRequest,
} from 'resources/types/requests/AccountTypes';
import {
    CreateUserResponse,
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
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { AxiosError } from 'axios';
import { GetBooleanResponse } from 'resources/types/requests/GeneralTypes';

export interface UserModel {
    uid: string;
    access_level: string;
    email: string;
    post_notification_token?: string;
    today_widgets?: string[];
    timestamp: Timestamp;
}

const ACCOUNT_ENDPOINT = 'account';
const USER_ENDPOINT = 'user';

class UserController {
    public static async createAccount(email: string, password: string): Promise<Response> {
        const body: CreateAccountRequest = {
            email,
            password,
        };

        return await axiosInstance
            .post(`/${ACCOUNT_ENDPOINT}/v1/create/`, body)
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
            .post(`/${ACCOUNT_ENDPOINT}/v1/forgot_password/`, body)
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
            .post(`/${ACCOUNT_ENDPOINT}/v1/send_verification_email`, body)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async currentUserExists(): Promise<boolean> {
        try {
            const response = await axiosInstance.get(`/user/v1/currentUserExists`);
            const data: GetBooleanResponse = response.data;
            return data.result === true;
        } catch (error) {
            return false;
        }
    }

    public static async getCurrentUser(): Promise<User | undefined> {
        try {
            const success = await axiosInstance.get<GetUserResponse>(`/${USER_ENDPOINT}/v1/`);
            const response: GetUserResponse = success.data;
                        return response.user;
        } catch (error) {
                        return undefined;
        }
    }

    public static async getUserByUidViaApi(uid: string): Promise<GetUserResponse> {
        try {
            const success = await axiosInstance.get(`/${USER_ENDPOINT}/v1/${uid}`);
            return success.data;
        } catch (error) {
            return error.response.data;
        }
    }

    public static async createUser(): Promise<User | undefined> {
        try {
            const success = await axiosInstance.post(`/${USER_ENDPOINT}/v1/`);
            const response: CreateUserResponse = success.data;
            return response.user;
        } catch (error) {
            return undefined;
        }
    }

    public static async deleteUser() {
        await axiosInstance
            .post(`/${ACCOUNT_ENDPOINT}/v1/delete`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async setup(user: User): Promise<UpdateUserResponse> {
        const request: UpdateUserRequest = {
            user,
        };

        return await axiosInstance
            .patch(`${USER}v1/setup`, request)
            .then((success) => {
                const data: UpdateUserResponse = success.data;
                return data;
            })
            .catch((error: AxiosError) => {
                const data: UpdateUserResponse = error.response?.data as UpdateUserResponse;
                return data;
            });
    }

    public static async update(user: User): Promise<User | undefined> {
        const request: UpdateUserRequest = { user };
        try {
            const response = await axiosInstance.patch(`${USER}v1/`, request);
            const updateUserResponse: UpdateUserResponse = response.data;
            return updateUserResponse.user;
        } catch (error) {
            return undefined;
        }
    }

    public static async search(query: string) {
        return await axiosInstance
            .get(`/${USER_ENDPOINT}/v1/search`, { params: { query } })
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
            .post(`/${ACCOUNT_ENDPOINT}/v1/refresh_token`)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async loginUser(): Promise<User | undefined> {
        let user: User | undefined = await this.getCurrentUser();
                if (!user) {
            user = await this.createUser();
            await this.forceRefreshIdToken();
        }

        return user;
    }

    public static async logoutUser() {
        await getAuth().signOut();
    }

    public static async usernameExists(username: string): Promise<boolean> {
        return await axiosInstance
            .get<GetBooleanResponse>(`/user/v1/exists`, { params: { username } })
            .then((success) => {
                return success.data.result === true;
            })
            .catch((error) => {
                return false;
            });
    }

    private static async forceRefreshIdToken() {
        await getAuth().currentUser?.getIdToken(true);
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

    public static async invalidateCurrentUser() {
        await reactQueryClient.invalidateQueries(['currentUser']);
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
