import { Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axiosInstance from 'src/axios/axios';
import { CreateAccountRequest, ForgotAccountPasswordRequest, VerifyAccountEmailRequest } from 'resources/types/requests/AccountTypes';
import { GetUserResponse, UpdateUserRequest } from 'resources/types/requests/UserTypes';
import { Response } from 'resources/types/requests/RequestTypes';
import { USER } from 'resources/endpoints';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { ImagePickerResult } from 'expo-image-picker';
import { pickImage } from 'src/util/ImagePickerUtil';
import { uploadImage } from 'src/firebase/cloud_storage/profiles/ProfileCsp';
import { User } from 'resources/schema';

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
                this.forceRefreshIdToken();
                return success.data;
            })
            .catch((error) => {
                getAuth().currentUser?.getIdToken(true);
                return error.response.data;
            });
    }

    public static async updateUserViaApi(request: UpdateUserRequest) {
        return await axiosInstance
            .patch(`${USER}`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async loginUser(uid: string): Promise<User | undefined> {
        let userResponse: GetUserResponse = await this.getUserByUidViaApi(uid);
        if (userResponse.success && userResponse.user) {
            return userResponse.user;
        }

        const result = await this.createUser();
        if (result.success) {
            userResponse = await this.getUserByUidViaApi(uid);
            if (userResponse.success && userResponse.user) {
                return userResponse.user;
            }
        }

        return undefined;
    }

    private static async forceRefreshIdToken() {
        await getAuth().currentUser?.getIdToken(true);
    }

    public static async getCurrentUser() {
        const uid = getCurrentUid();
        return await this.getUserByUidViaApi(uid);
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

export default UserController;
