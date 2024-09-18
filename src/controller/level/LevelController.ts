import { useQuery } from '@tanstack/react-query';
import { ReduxService } from 'src/redux/ReduxService';
import { LOG_LEVEL } from 'react-native-purchases';
import { Level, User } from 'resources/schema';
import { LevelDetails } from 'resources/types/dto/Level';
import { GetLevelDetailsResponse, GetLevelsResponse } from 'resources/types/requests/LevelTypes';
import axiosInstance from 'src/axios/axios';
import { reactQueryClient } from 'src/react_query/ReactQueryClient';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { ReactQueryStaleTimes } from 'src/util/constants';
import UserController from '../user/UserController';
import { DropDownAlertModal } from 'src/model/DropDownAlertModel';
import { UserPropertyUtil } from 'src/util/UserPropertyUtil';

export class LevelController {
    private static debounceTimeout: NodeJS.Timeout | null = null;

    public static async getLevelDetailsForUser(userId: number): Promise<LevelDetails | undefined> {
        return axiosInstance
            .get<GetLevelDetailsResponse>(`/user/${userId}/level/`)
            .then((success) => {
                const response = success.data;
                return response.levelDetails;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static async getAllLevels(): Promise<Level[] | undefined> {
        return axiosInstance
            .get<GetLevelsResponse>(`/level/`)
            .then((success) => {
                const response = success.data;
                return response.levels;
            })
            .catch((error) => {
                return undefined;
            });
    }

    public static debounceLevelDetails(
        userId: number,
        levelDetails: LevelDetails,
        displayDropDownAlert: Function,
        fireConfetti: Function
    ) {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }

        this.debounceTimeout = setTimeout(() => {
            reactQueryClient.setQueryData(['levelDetails', userId], levelDetails);
            const currentUser = ReduxService.get(ReduxService.ReduxKey.CURRENT_USER) as User;
            const currentUserLevel = UserPropertyUtil.getLevel(currentUser);

            if (
                !!levelDetails.level.level &&
                !!currentUserLevel &&
                levelDetails.level.level !== currentUserLevel
            ) {
                const levelUp = levelDetails.level.level > currentUserLevel;
                if (levelUp) {
                    const dropDownAlertModel: DropDownAlertModal = {
                        title: 'Level Up!',
                        body: `You've reached level ${levelDetails.level.level}!`,
                        icon: levelDetails.level.badge?.icon ?? {},
                        badgeUrl: '',
                    };
                    displayDropDownAlert(dropDownAlertModel);
                    fireConfetti();
                }

                UserController.invalidateCurrentUser();
                UserController.refreshCurrentUser();
            }
        }, 1200);
    }

    public static clearDebounce() {
        if (this.debounceTimeout) {
            clearTimeout(this.debounceTimeout);
        }
    }

    public static invalidateLevelDetails(userId: number) {
        reactQueryClient.invalidateQueries(['levelDetails', userId]);
    }

    public static addPointsToLevelDetails(userId: number, points: number) {
        const levelDetails = reactQueryClient.getQueryData<LevelDetails>(['levelDetails', userId]);
        if (levelDetails) {
            const updatedLevelDetails: LevelDetails = {
                ...levelDetails,
                points: levelDetails.points + points,
            };

            const currentPoints = levelDetails.points;
            const minPointsForLevel = levelDetails.level.minPoints ?? 99999999999;
            const maxPointsForLevel = levelDetails.level.maxPoints ?? 0;

            if (currentPoints < minPointsForLevel) {
                this.invalidateLevelDetails(userId);
            } else if (currentPoints >= maxPointsForLevel) {
                this.invalidateLevelDetails(userId);
            } else {
                reactQueryClient.setQueryData(['levelDetails', userId], updatedLevelDetails);
            }
        } else {
            const levelDetails: LevelDetails = {
                level: {
                    level: 1,
                },
                points: points,
            };

            reactQueryClient.setQueryData(['levelDetails', userId], levelDetails);
        }
    }
}

export namespace LevelCustomHooks {
    export function useLevelDetails(userId?: number) {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: ['levelDetails', userId],
            queryFn: () => LevelController.getLevelDetailsForUser(userId ?? 0),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
            enabled: !!userId,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    }

    export function useLevelDetailsForCurrentUser() {
        const currentUser = useAppSelector(getCurrentUser);
        return useLevelDetails(currentUser?.id);
    }

    export function useAllLevels() {
        const { status, error, data, fetchStatus, refetch } = useQuery({
            queryKey: ['allLevels'],
            queryFn: () => LevelController.getAllLevels(),
            staleTime: ReactQueryStaleTimes.INSTANTLY,
        });

        return { isLoading: status === 'loading' && fetchStatus !== 'idle', data, refetch };
    }
}
