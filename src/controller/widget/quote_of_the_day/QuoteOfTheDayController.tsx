import {
    CreateQuoteOfTheDayRequest,
    GetQuoteOfTheDayResponse,
} from 'resources/types/requests/QuoteOfTheDayTypes';
import axiosInstance from 'src/axios/axios';
import { useQuery } from '@tanstack/react-query';
import { ReactQueryStaleTimes } from 'src/util/constants';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import { QuoteOfTheDay } from 'resources/schema';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';

export class QuoteOfTheDayController {
    public static async get(): Promise<QuoteOfTheDay> {
        return await axiosInstance
            .get(`/quote-of-the-day/`)
            .then((success) => {
                const response: GetQuoteOfTheDayResponse = success.data;
                return response.quoteOfTheDay;
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

    public static async prefetchQuoteOfTheDay() {
        reactQueryClient.prefetchQuery({
            queryKey: ['quoteOfTheDay'],
            queryFn: () => QuoteOfTheDayController.get(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });
    }

    public static async invalidateQuoteOfTheDay() {
        await reactQueryClient.invalidateQueries(['quoteOfTheDay']);
    }
}
export namespace QuoteOfTheDayCustomHooks {
    export const useQuoteOfTheDay = () => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['quoteOfTheDay'],
            queryFn: () => QuoteOfTheDayController.get(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
