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
    getLevelDetails,
    setLevelDetails,
} from 'src/redux/user/GlobalState';
import { getApiUrl } from 'src/util/UrlUtility';
import * as StoreReview from 'expo-store-review';
import { AppState } from 'react-native';

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

        this.socket.on('connect', () => {
            console.log('WebSocketService connected');
        });

        this.socket.on('disconnect', () => {
            console.log('WebSocketService disconnected');
        });

        this.socket.connect();
    }
}

export namespace WebSocketCustomHooks {
    export const useWebSocket = () => {
        const socket = WebSocketService.getSocket();

        const fireConfetti = useAppSelector(getFireConfetti);
        const firePoints = useAppSelector(getFirePoints);
        const currentUser = useAppSelector(getCurrentUser);
        const currentLevelDetails = useAppSelector(getLevelDetails);
        const dispatch = useAppDispatch();

        React.useEffect(() => {
            console.log('adding event listeners');
            AppState.addEventListener('change', (e) => {
                if (e === 'active') {
                    socket.connect();
                } else {
                    socket.disconnect();
                }
            });
        }, []);

        /*
         * FIRE_CONFETTI EVENT
         */
        React.useEffect(() => {
            socket.on(Constants.WebSocketEventType.FIRE_CONFETTI, (payload: WebSocketPayload) => {
                fireConfetti();
            });

            return () => {
                socket.off(Constants.WebSocketEventType.FIRE_CONFETTI);
            };
        }, [fireConfetti, socket]);

        /*
         * DAY_COMPLETE EVENT
         */
        React.useEffect(() => {
            socket.on(Constants.WebSocketEventType.DAY_COMPLETE, (payload: WebSocketPayload) => {
                const requestReview = async () => {
                    const isAvailable = await StoreReview.isAvailableAsync();
                    if (isAvailable) {
                        StoreReview.requestReview();
                    }
                };

                requestReview();
                fireConfetti();
            });

            return () => {
                socket.off(Constants.WebSocketEventType.DAY_COMPLETE);
            };
        }, [fireConfetti, socket]);

        /*
         * HABIT_STREAK_UPDATED EVENT
         */
        React.useEffect(() => {
            socket.on(
                Constants.WebSocketEventType.HABIT_STREAK_UPDATED,
                (payload: WebSocketPayload) => {
                    UserController.invalidateUserHabitStreakTier(currentUser.id ?? 0);
                    UserController.invalidateUser(currentUser.uid ?? '');
                    UserController.invalidateCurrentUser();
                }
            );

            return () => {
                socket.off(Constants.WebSocketEventType.HABIT_STREAK_UPDATED);
            };
        }, [socket]);

        /*
         * LEVEL_DETAILS_UPDATED EVENT
         */
        React.useEffect(() => {
            socket.on(
                Constants.WebSocketEventType.LEVEL_DETAILS_UPDATED,
                (payload: WebSocketPayload) => {
                    const levelDetails = payload.payload.levelDetails;
                    dispatch(setLevelDetails(levelDetails));

                    const points = levelDetails.points - currentLevelDetails.points;
                    if (points != 0) {
                        firePoints(levelDetails.points - currentLevelDetails.points);
                    }

                    const levelChange = levelDetails.level - (currentLevelDetails.level.level ?? 0);
                    if (levelChange > 0) {
                        fireConfetti();
                    }
                }
            );

            return () => {
                socket.off(Constants.WebSocketEventType.LEVEL_DETAILS_UPDATED);
            };
        }, [fireConfetti, firePoints, currentLevelDetails, socket]);

        /*
         * USER_UPDATED EVENT
         */
        React.useEffect(() => {
            socket.on(Constants.WebSocketEventType.USER_UPDATED, (payload: WebSocketPayload) => {
                //UserController.refreshCurrentUser();
                UserController.invalidateCurrentUser();
            });

            return () => {
                socket.off(Constants.WebSocketEventType.USER_UPDATED);
            };
        }, [socket]);
    };
}
