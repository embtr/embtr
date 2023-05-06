import { Metadata } from 'resources/schema';
import { GetAllMetadataResonse } from 'resources/types/requests/MetadataTypes';
import axiosInstance from 'src/axios/axios';

// enum with string values
export enum MetadataKey {
    VERSION = 'VERSION',
    RECOMMENDED_TASKS = 'RECOMMENDED_TASKS',
}

export class MetadataController {
    public static async getMetadata(key: MetadataKey) {
        return await axiosInstance
            .get('/metadata/')
            .then((success) => {
                const response = success.data as GetAllMetadataResonse;
                response.metadata.forEach((metadata) => {
                    if (metadata.key === key) {
                        return metadata;
                    }
                });
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });
    }
}
