import { useQuery } from '@tanstack/react-query';
import { User } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
import {
    GetUserReminderNotificationResponse,
    GetUserSocialNotificationResponse,
    GetUserTimezoneResponse,
    GetUserTutorialCompletionStateResponse,
    GetUserWarningNotificationResponse,
    SetUserReminderNotificationRequest,
    SetUserReminderNotificationResponse,
    SetUserSocialNotificationRequest,
    SetUserSocialNotificationResponse,
    SetUserTimezoneRequest,
    SetUserTimezoneResponse,
    SetUserTutorialCompletionStateRequest,
    SetUserTutorialCompletionStateResponse,
    SetUserWarningNotificationRequest,
    SetUserWarningNotificationResponse,
} from 'resources/types/requests/UserPropertyTypes';
import {
    GetAwayModeResponse,
    UpdateAwayModeRequest,
    UpdateAwayModeResponse,
} from 'resources/types/requests/UserTypes';
import axiosInstance from 'src/axios/axios';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class UserPropertyController {
    public static async setTimezone(timezone: string): Promise<string | undefined> {
        const request: SetUserTimezoneRequest = {
            timezone,
        };

        return await axiosInstance
            .post<SetUserTimezoneResponse>(`/user/property/timezone`, request)
            .then((success) => {
                return success.data.timezone;
            })
            .catch((error) => {
                return error.response.data;
            });
    }

    public static async setTutorialCompletionState(
        state: Constants.CompletionState
    ): Promise<User | undefined> {
        const request: SetUserTutorialCompletionStateRequest = { state };

        return await axiosInstance
            .post<SetUserTutorialCompletionStateResponse>(`/user/property/tutorial`, request)
            .then((success) => {
                return success.data.user;
            })
            .catch(() => {
                return undefined;
            });
    }

    public static async getTutorialCompletionState(): Promise<
        Constants.CompletionState | undefined
    > {
        return await axiosInstance
            .get<GetUserTutorialCompletionStateResponse>(`/user/property/tutorial`)
            .then((success) => {
                return success.data.state;
            })
            .catch(() => {
                return undefined;
            });
    }

    public static async getTimezone(): Promise<string | undefined> {
        return await axiosInstance
            .get<GetUserTimezoneResponse>(`/user/property/timezone`)
            .then(async (success) => {
                if (success.data.timezone === 'N/A') {
                    return await this.setDefaultTimezone();
                }

                return success.data.timezone;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async setDefaultTimezone() {
        const currentTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return await this.setTimezone(currentTimezone);
    }

    public static async setSocialNotification(setting: Constants.SocialNotificationSetting) {
        const request: SetUserSocialNotificationRequest = {
            setting,
        };

        return await axiosInstance
            .post<SetUserSocialNotificationResponse>(`/user/property/notifications/social`, request)
            .then((success) => {
                return success.data.setting;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getSocialNotification(): Promise<
        Constants.SocialNotificationSetting | undefined
    > {
        return await axiosInstance
            .get<GetUserSocialNotificationResponse>(`/user/property/notifications/social`)
            .then((success) => {
                return success.data.setting;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async setRemindersNotification(setting: Constants.ReminderNotificationSetting) {
        const request: SetUserReminderNotificationRequest = {
            setting,
        };

        return await axiosInstance
            .post<SetUserReminderNotificationResponse>(
                `/user/property/notifications/reminders`,
                request
            )
            .then((success) => {
                return success.data.setting;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getRemindersNotification(): Promise<
        Constants.ReminderNotificationSetting | undefined
    > {
        return await axiosInstance
            .get<GetUserReminderNotificationResponse>(`/user/property/notifications/reminders`)
            .then((success) => {
                return success.data.setting;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getAwayMode(): Promise<Constants.AwayMode | undefined> {
        return await axiosInstance
            .get<GetAwayModeResponse>(`/user/property/away/`)
            .then((success) => {
                return success.data.awayMode;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async setAwayMode(awayMode: Constants.AwayMode) {
        const request: UpdateAwayModeRequest = {
            awayMode,
        };

        return await axiosInstance
            .post<UpdateAwayModeResponse>(`/user/property/away/`, request)
            .then((success) => {
                return success.data.awayMode;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async setWarningsNotification(setting: Constants.WarningNotificationSetting) {
        const request: SetUserWarningNotificationRequest = {
            setting,
        };

        return await axiosInstance
            .post<SetUserWarningNotificationResponse>(
                `/user/property/notifications/warnings`,
                request
            )
            .then((success) => {
                return success.data.setting;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getWarningsNotification(): Promise<
        Constants.WarningNotificationSetting | undefined
    > {
        return await axiosInstance
            .get<GetUserWarningNotificationResponse>(`/user/property/notifications/warnings`)
            .then((success) => {
                return success.data.setting;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async invalidateTimezone() {
        reactQueryClient.invalidateQueries(['timezone']);
    }

    public static async invalidateSocialNotification() {
        reactQueryClient.invalidateQueries(['socialNotificationSetting']);
    }

    public static async invalidateReminderNotification() {
        reactQueryClient.invalidateQueries(['reminderNotificationSetting']);
    }

    public static async invalidateWarningNotification() {
        reactQueryClient.invalidateQueries(['warningNotificationSetting']);
    }

    public static async invalidateAwayMode() {
        reactQueryClient.invalidateQueries(['awayModeSetting']);
    }
}

export namespace UserPropertyCustomHooks {
    export const useTutorialComlete = () => {
        const { status, data, fetchStatus } = useQuery({
            queryKey: ['tutorial'],
            queryFn: () => UserPropertyController.getTimezone(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useTimezone = () => {
        const { status, data, fetchStatus } = useQuery({
            queryKey: ['timezone'],
            queryFn: () => UserPropertyController.getTimezone(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useSocialNotificationSetting = () => {
        const { status, data, fetchStatus } = useQuery({
            queryKey: ['socialNotificationSetting'],
            queryFn: () => UserPropertyController.getSocialNotification(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useReminderNotificationSetting = () => {
        const { status, data, fetchStatus } = useQuery({
            queryKey: ['reminderNotificationSetting'],
            queryFn: () => UserPropertyController.getRemindersNotification(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useAwayModeSetting = () => {
        const { status, data, fetchStatus, refetch } = useQuery({
            queryKey: ['awayModeSetting'],
            queryFn: () => UserPropertyController.getAwayMode(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    };

    export const useWarningNotificationSetting = () => {
        const { status, data, fetchStatus } = useQuery({
            queryKey: ['warningNotificationSetting'],
            queryFn: () => UserPropertyController.getWarningsNotification(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
