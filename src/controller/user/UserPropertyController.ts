import { Property } from 'resources/schema';
import {
    CreatePropertyRequest,
    CreatePropertyResponse,
    GetPropertiesResponse,
    GetPropertyResponse,
} from 'resources/types/requests/UserTypes';
import axiosInstance from 'src/axios/axios';
import { UserProperty } from 'src/util/user/UserPropertyUtil';

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

    public static async get(userId: number, property: UserProperty) {
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
}
