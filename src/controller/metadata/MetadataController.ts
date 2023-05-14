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
                for (const metadata of response.metadata) {
                    console.log(metadata);
                    console.log(key);
                    if (metadata.key === key) {
                        return metadata.value;
                    }
                }

                return undefined;
            })
            .catch((error) => {
                console.log(error);
                return undefined;
            });
    }
}
