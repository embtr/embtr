import { User, getAuth } from 'firebase/auth';
import React from 'react';
import { Constants } from 'resources/types/constants/constants';
import { WebSocketPayload } from 'resources/types/requests/WebSocket';
import { Socket, io } from 'socket.io-client';
import UserController from 'src/controller/user/UserController';
import { useAppSelector } from 'src/redux/Hooks';
import {
    getCurrentUser,
    getDisplayDropDownAlert,
    getFireConfetti,
    getFirePoints,
} from 'src/redux/user/GlobalState';
import { getApiUrl } from 'src/util/UrlUtility';
import * as StoreReview from 'expo-store-review';
import { AppState } from 'react-native';
import { PointCustomHooks } from 'src/controller/PointController';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { LevelController } from 'src/controller/level/LevelController';
import { UserPropertyUtil } from 'src/util/UserPropertyUtil';

// Stuck in WebSocket limbo, dreaming of simplicity - TheIbraDev - 2024-09-18

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

    public static async connectIfNotConnected() {
        const currentUser = getAuth().currentUser;
        if (currentUser && !this.socket.connected) {
            await this.connect(currentUser);
        }
    }
}

export namespace WebSocketCustomHooks {
    export const useWebSocket = () => {
        const socket = WebSocketService.getSocket();

        const fireConfetti = useAppSelector(getFireConfetti);
        const currentUser = useAppSelector(getCurrentUser);
        const firePoints = useAppSelector(getFirePoints);
        const displayDropDownAlert = useAppSelector(getDisplayDropDownAlert);
        const dayCompletePoints = PointCustomHooks.useDayCompletePoints();

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
                //fireConfetti();
                //firePoints(dayCompletePoints);
            });

            return () => {
                socket.off(Constants.WebSocketEventType.DAY_COMPLETE);
            };
        }, [fireConfetti, socket, firePoints, dayCompletePoints]);

        /*
         * DAY_INCOMPLETE EVENT
         */
        React.useEffect(() => {
            socket.on(Constants.WebSocketEventType.DAY_INCOMPLETE, (payload: WebSocketPayload) => {
                getUserIdFromToken().then((userId) => {
                    if (userId) {
                        PlannedDayController.invalidatePlannedDayIsComplete(
                            userId,
                            payload.payload.dayKey
                        );
                    }
                });

                //firePoints(-dayCompletePoints);
            });

            return () => {
                socket.off(Constants.WebSocketEventType.DAY_INCOMPLETE);
            };
        }, [socket, firePoints, dayCompletePoints]);

        /*
         * HABIT_STREAK_UPDATED EVENT
         */
        React.useEffect(() => {
            socket.on(
                Constants.WebSocketEventType.HABIT_STREAK_UPDATED,
                (payload: WebSocketPayload) => {
                    UserController.invalidateUserHabitStreakTier(currentUser.id ?? 0);
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
                    LevelController.debounceLevelDetails(
                        currentUser.id ?? 0,
                        levelDetails,
                        displayDropDownAlert,
                        fireConfetti
                    );

                    /*
                    // send to some service to debounce it

                    //dispatch(setLevel(levelDetails.level.level));

                    const levelChange =
                        levelDetails.level.level - (currentLevelDetails.level.level ?? 0);
                    if (levelChange > 0) {
                        const dropDownAlertModel: DropDownAlertModal = {
                            title: 'Level Up!',
                            body: `You've reached level ${levelDetails.level.level}!`,
                            icon: levelDetails.level.badge.icon,
                            badgeUrl: '',
                        };
                        displayDropDownAlert(dropDownAlertModel);
                        fireConfetti();
                    }
                    */
                }
            );

            return () => {
                socket.off(Constants.WebSocketEventType.LEVEL_DETAILS_UPDATED);
            };
        }, [fireConfetti, socket]);

        /*
         * USER_UPDATED EVENT
         */
        React.useEffect(() => {
            socket.on(Constants.WebSocketEventType.USER_UPDATED, (payload: WebSocketPayload) => {
                //UserController.refreshCurrentUser();
                //UserController.invalidateCurrentUser();
            });

            return () => {
                socket.off(Constants.WebSocketEventType.USER_UPDATED);
            };
        }, [socket]);
    };
}
