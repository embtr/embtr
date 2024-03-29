import { useQuery } from '@tanstack/react-query';
import { Property } from 'resources/schema';
import { Constants } from 'resources/types/constants/constants';
import {
    CreatePropertyRequest,
    CreatePropertyResponse,
    GetPropertiesResponse,
    GetPropertyResponse,
} from 'resources/types/requests/UserTypes';
import axiosInstance from 'src/axios/axios';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { UserCustomHooks } from './UserController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';

export class UserPropertyController {
    public static async create(property: Property) {
        try {
            const request: CreatePropertyRequest = {
                property,
            };

            const response = await axiosInstance.post<CreatePropertyResponse>(
                `/user/property/`,
                request
            );
            return response.data.property;
        } catch (error) {
            return undefined;
        }
    }

    public static async get(userId: number, property: Constants.UserPropertyKey) {
        try {
            const response = await axiosInstance.get<GetPropertyResponse>(
                `/user/${userId}/property/${property}`
            );
            return response.data.property;
        } catch (error) {
            return undefined;
        }
    }

    public static async getAll(userId: number) {
        try {
            const response = await axiosInstance.get<GetPropertiesResponse>(
                `/user/${userId}/property/`
            );
            return response.data.properties;
        } catch (error) {
            return undefined;
        }
    }

    public static invalidate(userId: number, property: Constants.UserPropertyKey) {
        reactQueryClient.invalidateQueries(['userProperty', userId, property]);
    }
}

export namespace UserPropertyCustomHooks {
    export const useNewUserChecklistDismissed = () => {
        const currentUser = useAppSelector(getCurrentUser);
        return useUserProperty(
            currentUser.id ?? 0,
            Constants.UserPropertyKey.NEW_USER_CHECKLIST_DISMISSED
        );
    };

    export const useNewUserChecklistCompleted = () => {
        const currentUser = useAppSelector(getCurrentUser);
        return useUserProperty(
            currentUser.id ?? 0,
            Constants.UserPropertyKey.NEW_USER_CHECKLIST_COMPLETED
        );
    };

    const useUserProperty = (userId: number, property: Constants.UserPropertyKey) => {
        const { status, data, fetchStatus } = useQuery({
            queryKey: ['userProperty', userId, property],
            queryFn: () => UserPropertyController.get(userId, property),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
