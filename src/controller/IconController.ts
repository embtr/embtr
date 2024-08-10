import { useQuery } from '@tanstack/react-query';
import { Icon } from 'resources/schema';
import { GetIconResponse } from 'resources/types/requests/IconTypes';
import axiosInstance from 'src/axios/axios';
import { ReactQueryStaleTimes } from 'src/util/constants';

export class IconController {
    public static async getByKey(key: string): Promise<Icon | undefined> {
        return axiosInstance
            .get<GetIconResponse>(`/icon/${key}`)
            .then((success) => {
                return success.data.icon;
            })
            .catch(() => {
                return undefined;
            });
    }
}

export namespace IconCustomHooks {
    export const useIcon = (key: string) => {
        const { status, error, data, fetchStatus } = useQuery({
            queryKey: ['icon', key],
            queryFn: async () => IconController.getByKey(key),
            staleTime: ReactQueryStaleTimes.ONE_HOUR,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data };
    };
}
