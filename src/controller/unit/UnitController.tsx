import axiosInstance from 'src/axios/axios';
import { GetUnitsResponse } from 'resources/types/requests/UnitTypes';

export class UnitController {
    public static async getAll() {
        return axiosInstance
            .get<GetUnitsResponse>(`/unit/v1/`)
            .then((success) => {
                return success.data.units ?? [];
            })
            .catch((error) => {
                return [];
            });
    }
}
