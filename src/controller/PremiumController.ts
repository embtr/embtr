import axiosInstance from 'src/axios/axios';

export class PremiumController {
    public static purchasePremiumPressed(source: string) {
        return axiosInstance.post(`/premium/premiumPressed?source=` + source);
    }
}
