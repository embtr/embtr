import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { GetAllMetadataResponse } from 'resources/types/requests/MetadataTypes';

export enum MetadataKey {
    LATEST_IOS_VERSION = 'LATEST_IOS_VERSION',
    LATEST_ANDROID_VERSION = 'LATEST_ANDROID_VERSION',
    MINIMUM_IOS_VERSION = 'MINIMUM_IOS_VERSION',
    MINIMUM_ANDROID_VERSION = 'MINIMUM_ANDROID_VERSION',
    TERMS_VERSION = 'TERMS_VERSION',
}

export class MetadataController {
    public static async getMetadata(key: MetadataKey) {
        try {
            const success = await axiosInstance.get<GetAllMetadataResponse>('/metadata/');
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

    export const useLatestIosVersion = () => {
        return MetadataCustomHooks.useMetadata(MetadataKey.LATEST_IOS_VERSION);
    };

    export const useLatestAndroidVersion = () => {
        return MetadataCustomHooks.useMetadata(MetadataKey.LATEST_ANDROID_VERSION);
    };

    export const useMinimumIosVersion = () => {
        return MetadataCustomHooks.useMetadata(MetadataKey.MINIMUM_IOS_VERSION);
    };

    export const useMinimumAndroidVersion = () => {
        return MetadataCustomHooks.useMetadata(MetadataKey.MINIMUM_ANDROID_VERSION);
    };
}
