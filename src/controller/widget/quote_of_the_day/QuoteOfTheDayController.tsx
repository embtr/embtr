import { CreateQuoteOfTheDayRequest } from 'resources/types/requests/QuoteOfTheDayTypes';
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

    public static async create(quote: string, author: string) {
        const request: CreateQuoteOfTheDayRequest = { quote: quote, author: author };
        return await axiosInstance
            .post(`/quote-of-the-day/`, request)
            .then((success) => {
                return success.data.quoteOfTheDay;
            })
            .catch((error) => {
                return error.response.data;
            });
    }
}
