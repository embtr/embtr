import { GetAllMetadataResonse } from 'resources/types/requests/MetadataTypes';
import axiosInstance from 'src/axios/axios';

export enum MetadataKey {
    VERSION = 'VERSION',
    RECOMMENDED_TASKS = 'RECOMMENDED_TASKS',
    TIMELINE_DAYS = 'TIMELINE_DAYS',
}

export class MetadataController {
    public static async getMetadata(key: MetadataKey) {
        return await axiosInstance
            .get('/metadata/')
            .then((success) => {
                const response = success.data as GetAllMetadataResonse;
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
