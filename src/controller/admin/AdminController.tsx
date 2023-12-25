import axiosInstance from "src/axios/axios";

export class AdminController {
    public static async databasePingTest() {
        return axiosInstance.get(`/admin/database-ping/`)
            .then((success) => {
                return true;
            })
            .catch((error) => {
            return false;
            });
    }

    public static async pingTest() {
        return axiosInstance.get(`/admin/ping/`)
            .then((success) => {
                return true;
            })
            .catch((error) => {
            return false;
            });
    }
}