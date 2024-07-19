import { User } from 'firebase/auth';
import React from 'react';
import { Constants } from 'resources/types/constants/constants';
import { WebSocketPayload } from 'resources/types/requests/WebSocket';
import { Socket, io } from 'socket.io-client';
import UserController from 'src/controller/user/UserController';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import {
    getCurrentUser,
    getFireConfetti,
    getFirePoints,
    setLevelDetails,
    setPoints,
} from 'src/redux/user/GlobalState';
import { getApiUrl } from 'src/util/UrlUtility';
import * as StoreReview from 'expo-store-review';

export class WebSocketService {
    private static socket: Socket = io(getApiUrl(), {
        autoConnect: false,
    });

    public static getSocket() {
        return this.socket;
    }

    public static async connect(firebaseUser: User) {
        const token = await firebaseUser.getIdToken();
        this.socket.io.opts.query = {
            token: 'Bearer ' + token,
        };

        this.socket.connect();
    }
}

export namespace WebSocketCustomHooks {
    export const useWebSocket = () => {
        const fireConfetti = useAppSelector(getFireConfetti);
        const firePoints = useAppSelector(getFirePoints);
        const currentUser = useAppSelector(getCurrentUser);
        const dispatch = useAppDispatch();

        /*
         * FIRE_CONFETTI EVENT
         */
        React.useEffect(() => {
            WebSocketService.getSocket().on(
                Constants.WebSocketEventType.FIRE_CONFETTI,
                (payload: WebSocketPayload) => {
                    fireConfetti();
                }
            );

            return () => {
                WebSocketService.getSocket().off(Constants.WebSocketEventType.FIRE_CONFETTI);
            };
        }, [fireConfetti]);

        /*
         * DAY_COMPLETE EVENT
         */
        React.useEffect(() => {
            WebSocketService.getSocket().on(
                Constants.WebSocketEventType.DAY_COMPLETE,
                (payload: WebSocketPayload) => {
                    const requestReview = async () => {
                        const isAvailable = await StoreReview.isAvailableAsync();
                        if (isAvailable) {
                            StoreReview.requestReview();
                        }
                    };

                    requestReview();
                    fireConfetti();
                }
            );

            return () => {
                WebSocketService.getSocket().off(Constants.WebSocketEventType.DAY_COMPLETE);
            };
        }, [fireConfetti]);

        /*
         * HABIT_STREAK_UPDATED EVENT
         */
        React.useEffect(() => {
            WebSocketService.getSocket().on(
                Constants.WebSocketEventType.HABIT_STREAK_UPDATED,
                (payload: WebSocketPayload) => {
                    UserController.invalidateUserHabitStreakTier(currentUser.id ?? 0);
                    UserController.invalidateUser(currentUser.uid ?? '');
                    UserController.invalidateCurrentUser();
                }
            );

            return () => {
                WebSocketService.getSocket().off(Constants.WebSocketEventType.HABIT_STREAK_UPDATED);
            };
        }, []);

        /*
         * LEVEL_DETAILS_UPDATED EVENT
         */
        React.useEffect(() => {
            WebSocketService.getSocket().on(
                Constants.WebSocketEventType.LEVEL_DETAILS_UPDATED,
                (payload: WebSocketPayload) => {
                    const levelDetails = payload.payload.levelDetails;
                    dispatch(setLevelDetails(levelDetails));
                }
            );

            return () => {
                WebSocketService.getSocket().off(
                    Constants.WebSocketEventType.LEVEL_DETAILS_UPDATED
                );
            };
        }, [firePoints]);
    };
}
