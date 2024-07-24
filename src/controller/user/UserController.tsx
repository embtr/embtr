import { Timestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axiosInstance from 'src/axios/axios';
import {
    CreateAccountRequest,
    ForgotAccountPasswordRequest,
    VerifyAccountEmailRequest,
} from 'resources/types/requests/AccountTypes';
import {
    CreateBlockUserRequest,
    CreateUserResponse,
    GetUserResponse,
    GetUsersResponse,
    UpdatePremiumStatusResponse,
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
import { useAppSelector } from 'src/redux/Hooks';
import { UserService } from 'src/service/UserService';
import { getCurrentUser, getFireConfetti, setCurrentUser } from 'src/redux/user/GlobalState';
import { RevenueCat } from '../revenuecat/RevenueCat';
import { RevenueCatProvider } from '../revenuecat/RevenueCatProvider';
import { Store } from 'src/redux/store';
import { PremiumController } from '../PremiumController';
import { UserHabitStreakTier } from 'resources/types/dto/HabitStreak';
import { GetUserHabitStreakTierResponse } from 'resources/types/requests/HabitStreakTypes';
import { UserPropertyController } from './UserPropertyController';

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

    public static async currentUserExists(): Promise<boolean> {
        try {
            const response = await axiosInstance.get(`/user/currentUserExists`);
            const data: GetBooleanResponse = response.data;
            return data.result === true;
        } catch (error) {
            return false;
        }
    }

    public static async getCurrentUser(): Promise<User | undefined> {
        try {
            const success = await axiosInstance.get<GetUserResponse>(`/user/`);
            const response: GetUserResponse = success.data;
            return response.user;
        } catch (error) {
            return undefined;
        }
    }

    public static async getUserByUidViaApi(uid: string): Promise<User | undefined> {
        try {
            const success = await axiosInstance.get<GetUserResponse>(`/${USER_ENDPOINT}/${uid}`);
            return success.data.user;
        } catch (error) {
            return undefined;
        }
    }

    public static async createUser(): Promise<User | undefined> {
        try {
            const success = await axiosInstance.post(`/${USER_ENDPOINT}/`);
            const response: CreateUserResponse = success.data;
            return response.user;
        } catch (error) {
            return undefined;
        }
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

    public static async setup(user: User): Promise<UpdateUserResponse> {
        const request: UpdateUserRequest = {
            user,
        };

        return await axiosInstance
            .patch(`${USER}setup`, request)
            .then((success) => {
                const data: UpdateUserResponse = success.data;
                return data;
            })
            .catch((error: AxiosError) => {
                const data: UpdateUserResponse = error.response?.data as UpdateUserResponse;
                return data;
            });
    }

    public static async update(user: User): Promise<UpdateUserResponse> {
        const request: UpdateUserRequest = { user };

        return await axiosInstance
            .patch(`${USER}`, request)
            .then((success) => {
                const data: UpdateUserResponse = success.data;
                return data;
            })
            .catch((error: AxiosError) => {
                const data: UpdateUserResponse = error.response?.data as UpdateUserResponse;
                return data;
            });
    }

    public static async search(query: string) {
        return await axiosInstance
            .get<GetUsersResponse>(`/user/search`, { params: { query } })
            .then((success) => {
                return success.data.users;
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
        let user: User | undefined = await this.getCurrentUser();
        if (!user) {
            user = await this.createUser();

            await this.forceRefreshIdToken();

            await Promise.allSettled([
                UserPropertyController.setDefaultTimezone(),
                UserPropertyController.setOperatingSystem(),
            ]);
        }

        return user;
    }

    public static async logoutUser() {
        await getAuth().signOut();
    }

    public static async usernameExists(username: string): Promise<boolean> {
        return await axiosInstance
            .get<GetBooleanResponse>(`/user/exists`, { params: { username } })
            .then((success) => {
                return success.data.result === true;
            })
            .catch((error) => {
                return false;
            });
    }

    public static async blockUser(id: number) {
        const request: CreateBlockUserRequest = {
            userId: id,
        };

        return await axiosInstance
            .post(`/user/block/`, request)
            .then((success) => {
                return success.data;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async refreshPremiumStatus(): Promise<User> {
        return await axiosInstance
            .post<UpdatePremiumStatusResponse>(`/user/premium/`)
            .then((success) => {
                return success.data.user;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async forceRefreshIdToken() {
        await getAuth().currentUser?.getIdToken(true);
    }

    public static async refreshCurrentUser() {
        await UserController.forceRefreshIdToken();
        const currentUser = await UserController.getCurrentUser();
        Store.dispatch(setCurrentUser(currentUser));
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

    public static async invalidateUser(uid: string) {
        await reactQueryClient.invalidateQueries(['userByUid', uid]);
    }

    public static async invalidateNewUserChecklist() {
        await reactQueryClient.invalidateQueries(['newUserChecklist']);
    }

    public static async runPremiumWorkflow(source: string) {
        PremiumController.purchasePremiumPressed(source);

        const revenueCat: RevenueCat = RevenueCatProvider.get();

        const purchased = await revenueCat.executePaywallWorkflow();
        await UserController.forceRefreshIdToken();
        const currentUser = await UserController.getCurrentUser();
        Store.dispatch(setCurrentUser(currentUser));

        return purchased;
    }

    public static async getUserHabitStreakTier(
        userId: number
    ): Promise<UserHabitStreakTier | undefined> {
        return axiosInstance
            .get<GetUserHabitStreakTierResponse>(`user/${userId}/habit-streak-tier/`)
            .then((success) => {
                const response: GetUserHabitStreakTierResponse = success.data;
                return response.userHabitStreakTier;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async invalidateUserHabitStreakTier(userId: number) {
        await reactQueryClient.invalidateQueries(['habitStreakTier', userId]);
    }
}

export namespace UserCustomHooks {
    export const usePurchasePremium = () => {
        const fireConfetti = useAppSelector(getFireConfetti);

        const runPremiumWorkflow = async (source: string) => {
            const premiumWasPurchasd = await UserController.runPremiumWorkflow(source);
            if (premiumWasPurchasd) {
                fireConfetti();
            }

            return premiumWasPurchasd;
        };

        return runPremiumWorkflow;
    };

    export const useCurrentUser = () => {
        const { status, data, fetchStatus } = useQuery({
            queryKey: ['currentUser'],
            queryFn: () => UserController.getCurrentUser(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useCurrentUserId = () => {
        const { status, data, fetchStatus } = useQuery({
            queryKey: ['currentUserId'],
            queryFn: () => getUserIdFromToken(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useUserIsPremium = () => {
        const currentUser = useAppSelector(getCurrentUser);
        return UserService.userHasPremiumRole(currentUser);
    };

    export const useIsCurrentUser = (user: User) => {
        const currentUser = useAppSelector(getCurrentUser);
        return currentUser.uid === user.uid;
    };

    export const useUserByUid = (uid: string) => {
        const { status, data, fetchStatus } = useQuery({
            queryKey: ['userByUid', uid],
            queryFn: () => UserController.getUserByUidViaApi(uid),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled: !!uid,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export function useUserHabitSreakTier(userId: number) {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: ['habitStreakTier', userId],
            queryFn: () => UserController.getUserHabitStreakTier(userId),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    }
}

export default UserController;
