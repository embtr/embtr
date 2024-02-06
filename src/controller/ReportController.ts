import { CreateReportDto } from 'resources/types/dto/Report';
import { CreateReportRequest } from 'resources/types/requests/ReportTypes';
import axiosInstance from 'src/axios/axios';

export namespace ReportController {
    export const createReport = async (report: CreateReportDto) => {
        const request: CreateReportRequest = {
            report: report,
        };
        await axiosInstance.post(`/report/`, request);
    };
}
