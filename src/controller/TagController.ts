import { useQuery } from '@tanstack/react-query';
import { Constants } from 'resources/types/constants/constants';
import { GetTagsResponse } from 'resources/types/requests/TagTypes';
import axiosInstance from 'src/axios/axios';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class TagController {
    public static async getAllByCategory(category: Constants.TagCategory) {
        return axiosInstance
            .get<GetTagsResponse>(`/tag/${category}`)
            .then((response) => {
                return response.data.tags;
            })
            .catch(() => {
                return undefined;
            });
    }
}

export namespace TagCustomHooks {
    export const useTagsByCategory = (category: Constants.TagCategory) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['tags', category],
            queryFn: async () => await TagController.getAllByCategory(category),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
