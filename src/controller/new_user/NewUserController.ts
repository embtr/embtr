import { useQuery } from '@tanstack/react-query';
import { NewUserChecklist } from 'resources/types/dto/NewUserChecklist';
import { GetNewUserChecklistResponse } from 'resources/types/requests/UserTypes';
import axiosInstance from 'src/axios/axios';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { GetBooleanResponse } from 'resources/types/requests/GeneralTypes';

export class NewUserController {
    public static async getNewUserChecklist(): Promise<NewUserChecklist | undefined> {
        return await axiosInstance
            .get<GetNewUserChecklistResponse>(`/new-user/checklist/`)
            .then((success) => {
                return success.data.checklist;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async dismissNewUserChecklist(): Promise<boolean> {
        return await axiosInstance
            .post(`/new-user/checklist/dismiss/`)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    public static async completeNewUserChecklist(): Promise<boolean> {
        return await axiosInstance
            .post(`/new-user/checklist/complete/`)
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });
    }

    public static async getNewUserChecklistDismissed(): Promise<boolean | undefined> {
        return await axiosInstance
            .get<GetBooleanResponse>(`/new-user/checklist/dismissed/`)
            .then((result) => {
                return result.data.result === true;
            })
            .catch(() => {
                return undefined;
            });
    }

    public static async getNewUserChecklistCompleted(): Promise<boolean | undefined> {
        return await axiosInstance
            .get<GetBooleanResponse>(`/new-user/checklist/completed/`)
            .then((result) => {
                return result.data.result === true;
            })
            .catch(() => {
                return undefined;
            });
    }

    public static async invalidateNewUserChecklistDismissed(): Promise<void> {
        reactQueryClient.invalidateQueries(['newUserChecklistDismissed']);
    }

    public static async invalidateNewUserChecklistCompleted(): Promise<void> {
        reactQueryClient.invalidateQueries(['newUserChecklistCompleted']);
    }
}

export namespace NewUserCustomHooks {
    export const useNewUserChecklist = () => {
        const { status, data, fetchStatus, refetch } = useQuery({
            queryKey: ['newUserChecklist'],
            queryFn: () => NewUserController.getNewUserChecklist(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    };

    export const useUserHasFinishedNewUserChecklist = () => {
        const newUserChecklistDismissed = NewUserCustomHooks.useNewUserChecklistDismissed();
        const newUserChecklistCompleted = NewUserCustomHooks.useNewUserChecklistCompleted();

        return newUserChecklistDismissed || newUserChecklistCompleted;
    };

    export const useNewUserChecklistDismissed = (): boolean => {
        const { data } = useQuery({
            queryKey: ['newUserChecklistDismissed'],
            queryFn: () => NewUserController.getNewUserChecklistDismissed(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return data === true;
    };

    export const useNewUserChecklistCompleted = () => {
        const { data } = useQuery({
            queryKey: ['newUserChecklistCompleted'],
            queryFn: () => NewUserController.getNewUserChecklistCompleted(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return data === true;
    };
}
