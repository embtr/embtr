import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import { GetAllMetadataResponse } from 'resources/types/requests/MetadataTypes';

export enum MetadataKey {
    VERSION = 'VERSION',
    RECOMMENDED_TASKS = 'RECOMMENDED_TASKS',
    TIMELINE_DAYS = 'TIMELINE_DAYS',
    TERMS_VERSION = 'TERMS_VERSION',
}

export class MetadataController {
    public static async getMetadata(key: MetadataKey) {
        return await axiosInstance
            .get('/metadata/')
            .then((success) => {
                const response = success.data as GetAllMetadataResponse;
                for (const metadata of response.metadata) {
                    if (metadata.key === key) {
                        return metadata.value;
                    }
                }

                return undefined;
            })
            .catch((error) => {
                return undefined;
            });
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

    export const useTermsVersion = () => {
        return MetadataCustomHooks.useMetadata(MetadataKey.TERMS_VERSION);
    };

    export const useVersion = () => {
        return MetadataController.getMetadata(MetadataKey.VERSION);
    };
}
