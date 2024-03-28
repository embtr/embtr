import { useQuery } from '@tanstack/react-query';
import { Constants } from 'resources/types/constants/constants';
import { NewUserChecklist } from 'resources/types/dto/NewUserChecklist';
import { GetNewUserChecklistResponse } from 'resources/types/requests/UserTypes';
import axiosInstance from 'src/axios/axios';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { UserPropertyCustomHooks } from '../user/UserPropertyController';

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
}

export namespace NewUserCustomHooks {
    export const useNewUserChecklist = () => {
        const { status, data, fetchStatus } = useQuery({
            queryKey: ['newUserChecklist'],
            queryFn: () => NewUserController.getNewUserChecklist(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useUserHasFinishedNewUserChecklist = () => {
        const newUserChecklistDismissedUserProperty =
            UserPropertyCustomHooks.useNewUserChecklistDismissed();
        const newUserChecklistCompletedUserProperty =
            UserPropertyCustomHooks.useNewUserChecklistCompleted();

        return (
            newUserChecklistDismissedUserProperty.data !== undefined ||
            newUserChecklistCompletedUserProperty.data !== undefined
        );
    };
}
