import axiosInstance from 'src/axios/axios';
import { GetUnitsResponse } from 'resources/types/requests/UnitTypes';

export class UnitController {
    public static async getAll() {
        return axiosInstance
            .get(`/unit/`)
            .then((success) => {
                const body: GetUnitsResponse = success.data;
                return body.units ?? [];
            })
            .catch((error) => {
                return [];
            });
    }
}
