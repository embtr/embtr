import React, { Dispatch } from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { registerAuthStateListener } from 'src/session/CurrentUserProvider';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { SecureMainStack } from 'src/components/home/SecureMainStack';
import { InsecureMainStack } from 'src/components/home/InsecureMainStack';
import { Screen } from 'src/components/common/Screen';
import SafeAreaView from 'react-native-safe-area-view';
import { LogBox } from 'react-native';
import { Roboto_500Medium } from '@expo-google-fonts/roboto';
import {
    useFonts,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import UserController from './controller/user/UserController';
import { User } from 'firebase/auth';
import { getFirebaseConnection } from './firebase/firestore/ConnectionProvider';
import {
    getCurrentUser,
    setCurrentUser,
    setTimelineDays,
    setUnits,
    setUserProfileImage,
} from 'src/redux/user/GlobalState';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { User as UserModel } from 'resources/schema';
import PushNotificationController from './controller/notification/PushNotificationController';
import { ModalContainingComponent } from './components/common/modal/ModalContainingComponent';
import { NewVersionModal } from './components/main/NewVersionModal';
import { MetadataController, MetadataKey } from './controller/metadata/MetadataController';
import Constants from 'expo-constants';
import { UpdateUtility } from './util/updates/UpdateUtility';
import { ConfettiView } from './components/common/animated_view/ConfettiView';
import { UnitController } from 'src/controller/unit/UnitController';
import { DropDownAlert } from './components/common/drop_down_alert/DropDownAlert';
import { AnyAction } from '@reduxjs/toolkit';
import { QuickAddModal } from './components/home/tabmenu/QuickAddModal';

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['https://embtr.com', 'embtr://'],
    config: {
        screens: {
            LandingPage: '',
            Dashboard: {
                screens: {
                    CurrentUserTab: {
                        screens: {
                            Profile: 'profile',
                            UserSettings: 'settings',
                            PillarsConfiguration: 'configure',
                            EditUserProfile: 'editUserProfile',
                        },
                    },
                    TimelineTab: {
                        screens: {
                            UserSearch: 'search',
                            Timeline: 'timeline',
                            UserProfile: 'user',
                            UserPostDetails: {
                                path: 'timeline/:id/comments',
                                parse: {
                                    id: (id: string) => id,
                                },
                                //                                  stringify: {
                                //                                    id: (id) => id.replace(/^user-/, ''),
                                //                                  },
                            },
                            ChallengeDetails: {
                                path: 'challenge/:id/comments',
                                parse: {
                                    id: (id: string) => id,
                                },
                                //                                  stringify: {
                                //                                    id: (id) => id.replace(/^user-/, ''),
                                //                                  },
                            },
                            GoalDetails: {
                                path: 'goal/:uid/:id/comments',
                                parse: {
                                    id: (id: string) => id,
                                    source: 'timeline',
                                    uid: (uid: string) => uid,
                                },
                                //                                  stringify: {
                                //                                    id: (id) => id.replace(/^user-/, ''),
                                //                                  },
                            },
                            Notifications: 'notifications',
                        },
                    },
                    TodayTab: {
                        screens: {
                            Today: 'today',
                        },
                    },
                    PlanTab: {
                        screens: {
                            TaskDetails: {
                                path: 'tasks/:id/details',
                                parse: {
                                    id: (id: string) => id,
                                },
                                //                                  stringify: {
                                //                                    id: (id) => id.replace(/^user-/, ''),
                                //                                  },
                            },
                            CreateGoal: 'createGoal',
                            GoalDetails: {
                                path: 'goals/:id',
                                parse: { id: (id: string) => id },
                            },
                        },
                    },
                },
            },
            About: 'about',
            ReleaseNotes: 'releaseNotes',
            Contact: 'contact',
            Logout: 'logout',
        },
    },
};

export const Main = () => {
    const [user, setUser] = React.useState<User | undefined | null>(undefined);
    const [showUpdateAvailableModal, setShowUpdateAvailableModal] = React.useState(false);

    const currentUser = useAppSelector(getCurrentUser);

    React.useEffect(() => {
        const loginUnsubscribe = registerAuthStateListener(setUser);

        return () => {
            loginUnsubscribe();
        };
    }, []);

    const checkForUpdates = async () => {
        const currentVersion = Constants!.manifest!.version!;
        const latestVersion =
            (await MetadataController.getMetadata(MetadataKey.VERSION)) ?? currentVersion;

        let updateAvailable = UpdateUtility.updateIsAvailable(currentVersion, latestVersion);
        setShowUpdateAvailableModal(updateAvailable);
    };

    const loadUnits = async () => {
        const units = await UnitController.getAll();
        dispatch(setUnits(units));
    };

    const loadTimelineDays = async () => {
        const timelineDays = await MetadataController.getMetadata(MetadataKey.TIMELINE_DAYS);
        if (!timelineDays) {
            return;
        }

        dispatch(setTimelineDays(Number(timelineDays)));
    };

    const dispatch: Dispatch<AnyAction> = useAppDispatch();
    getFirebaseConnection('', '');

    LogBox.ignoreAllLogs();

    const resetGlobalState = (userToReset: UserModel) => {
        dispatch(setUserProfileImage(userToReset.photoUrl));
        dispatch(setCurrentUser(userToReset));
    };

    const createUserIfNew = async (user: User) => {
        if (!user.uid || !user.email) {
            return false;
        }

        const loggedInUser = await UserController.loginUser();

        return loggedInUser;
    };

    React.useEffect(() => {
        const blockingLoad = async () => {
            if (!user) {
                return;
            }

            const loggedInUser = await createUserIfNew(user);
            if (loggedInUser) {
                resetGlobalState(loggedInUser);
            }
        };

        blockingLoad();
    }, [user]);

    let [fontsLoaded] = useFonts({
        Poppins_400Regular_Italic,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Roboto_500Medium,
    });

    const userIsLoggedIn = Object.keys(currentUser ?? {}).length !== 0;

    React.useEffect(() => {
        if (!user || !userIsLoggedIn) {
            return;
        }

        const loads = [
            checkForUpdates,
            loadUnits,
            loadTimelineDays,
            PushNotificationController.registerForPushNotificationsAsync,
        ];
        Promise.all(loads.map((load) => load()));
    }, [user, userIsLoggedIn]);

    return (
        <Screen>
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{ flex: 1 }}>
                <NavigationContainer linking={linking} fallback={<LoadingPage />}>
                    {/* TOP LEVEL COMPONENTS */}
                    <ModalContainingComponent />
                    <QuickAddModal />
                    <ConfettiView />
                    <DropDownAlert />
                    <NewVersionModal
                        visible={showUpdateAvailableModal}
                        onDismiss={() => {
                            setShowUpdateAvailableModal(false);
                        }}
                    />
                    {/* END TOP LEVEL COMPONENTS */}

                    {(user === null || !userIsLoggedIn) && <InsecureMainStack />}
                    {user !== undefined && user !== null && userIsLoggedIn && <SecureMainStack />}
                </NavigationContainer>
            </SafeAreaView>
        </Screen>
    );
};
