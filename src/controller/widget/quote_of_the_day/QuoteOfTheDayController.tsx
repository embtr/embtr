import axiosInstance from 'src/axios/axios';

export class QuoteOfTheDayController {
    public static async get() {
        return await axiosInstance
            .get(`/quote-of-the-day/`)
            .then((success) => {
                return success.data.quoteOfTheDay;
            })
            .catch((error) => {
                return error.response.data;
            });
    }
}
