import { useQuery } from '@tanstack/react-query';
import { Feature } from 'resources/schema';
import { DetailedFeature } from 'resources/types/dto/Feature';
import {
    GetDetailedFeatureResponse,
    GetFeatureResponse,
    GetFeaturesResponse,
} from 'resources/types/requests/FeatureTypes';
import axiosInstance from 'src/axios/axios';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class FeatureController {
    public static async getAll(): Promise<Feature[]> {
        return axiosInstance
            .get<GetFeaturesResponse>(`/feature/`)
            .then((success) => {
                return success.data.features ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getAllDetailed(): Promise<DetailedFeature[]> {
        return axiosInstance
            .get<GetDetailedFeatureResponse>(`/feature/detailed`)
            .then((success) => {
                return success.data.detailedFeatures ?? [];
            })
            .catch((error) => {
                return [];
            });
    }

    public static async getVote(): Promise<Feature | undefined> {
        return axiosInstance
            .get<GetFeatureResponse>(`/feature/vote`)
            .then((success) => {
                return success.data.feature;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async vote(featureId: number): Promise<boolean> {
        return axiosInstance
            .post(`/feature/${featureId}/vote`)
            .then((success) => {
                return true;
            })
            .catch((error) => {
                return false;
            });
    }

    public static async invalidateFeatures() {
        await reactQueryClient.invalidateQueries(['currentUser']);
    }

    public static async invalidateDetailedFeatures() {
        await reactQueryClient.invalidateQueries(['detailedFeatures']);
    }

    public static async invalidateVote() {
        await reactQueryClient.invalidateQueries(['vote']);
    }
}

export namespace FeatureCustomHooks {
    export const useFeatures = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['features'],
            queryFn: async () => FeatureController.getAll(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useDetailedFeatures = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['detailedFeatures'],
            queryFn: async () => FeatureController.getAllDetailed(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useVote = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['vote'],
            queryFn: async () => FeatureController.getVote(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
