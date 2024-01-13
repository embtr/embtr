import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { GetAllMetadataResponse } from 'resources/types/requests/MetadataTypes';

export enum MetadataKey {
    LATEST_APP_VERSION = 'LATEST_APP_VERSION',
    MINIMUM_APP_VERSION = 'MINIMUM_APP_VERSION',
    RECOMMENDED_TASKS = 'RECOMMENDED_TASKS',
    TIMELINE_DAYS = 'TIMELINE_DAYS',
    TERMS_VERSION = 'TERMS_VERSION',
}

export class MetadataController {
    public static async getMetadata(key: MetadataKey) {
        try {
            const success = await axiosInstance.get<GetAllMetadataResponse>('/metadata/v1/');
            const response: GetAllMetadataResponse = success.data;
            return response.metadata.find((metadata) => metadata.key === key)?.value;
        } catch (error) {
            return undefined;
        }
    }
}

export namespace MetadataCustomHooks {
    export const useMetadata = (key: MetadataKey) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['metadata', key],
            queryFn: async () => MetadataController.getMetadata(key),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };

    export const useLatestTermsVersion = () => {
        return MetadataCustomHooks.useMetadata(MetadataKey.TERMS_VERSION);
    };

    export const useLatestAppVersion = () => {
        return MetadataCustomHooks.useMetadata(MetadataKey.LATEST_APP_VERSION);
    };

    export const useMinimumAppVersion = () => {
        return MetadataCustomHooks.useMetadata(MetadataKey.MINIMUM_APP_VERSION);
    };
}
