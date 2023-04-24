import { Metadata } from 'resources/schema';
import { GetAllMetadataResonse } from 'resources/types/requests/MetadataTypes';
import axiosInstance from 'src/axios/axios';

export class MetadataController {
    public static async getMetadata(): Promise<Metadata[]> {
        return await axiosInstance
            .get('/metadata/')
            .then((success) => {
                const response = success.data as GetAllMetadataResonse;
                return response.metadata ?? [];
            })
            .catch((error) => {
                console.log(error);
                return [];
            });
    }
}
