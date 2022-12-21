import React from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { getAccessLevel, getCurrentUser, setCurrentUser } from 'src/redux/user/GlobalState';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { SecureMainStack } from 'src/components/home/SecureMainStack';
import { InsecureMainStack } from 'src/components/home/InsecureMainStack';
import ProfileController from 'src/controller/profile/ProfileController';
import { Screen } from 'src/components/common/Screen';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import SafeAreaView from 'react-native-safe-area-view';
import { LogBox, View } from 'react-native';
import PushNotificationController from 'src/controller/notification/PushNotificationController';
import { useFonts, Poppins_400Regular, Poppins_400Regular_Italic, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import MigrationController from './controller/audit_log/MigrationController';
import UserController from './controller/user/UserController';

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
                                    id: (id) => id,
                                },
                                //                                  stringify: {
                                //                                    id: (id) => id.replace(/^user-/, ''),
                                //                                  },
                            },
                            ChallengeDetails: {
                                path: 'challenge/:id/comments',
                                parse: {
                                    id: (id) => id,
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
                                    id: (id) => id,
                                },
                                //                                  stringify: {
                                //                                    id: (id) => id.replace(/^user-/, ''),
                                //                                  },
                            },
                            CreateGoal: 'createGoal',
                            GoalDetails: {
                                path: 'goals/:id',
                                parse: { id: (id) => id },
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
    const accessLevel = useAppSelector(getAccessLevel);
    const [userIsLoggedIn, setUserIsLoggedIn] = React.useState<boolean | null>(null);
    const [loaded, setLoaded] = React.useState<boolean>(false);

    const dispatch = useAppDispatch();

    LogBox.ignoreAllLogs();

    React.useEffect(() => {
        const blockingLoad = async () => {
            let currentUser = await UserController.getCurrentUser();

            ProfileController.registerInitialProfileUpdateListener();
            PushNotificationController.registerUpdatePostNotificationTokenListener();

            //await MigrationController.handleMigrations();

            currentUser = await UserController.getCurrentUser();
            dispatch(setCurrentUser(currentUser));

            setLoaded(true);
        };
        if (userIsLoggedIn) {
            blockingLoad();
        } else {
            dispatch(setCurrentUser(undefined));
        }
    }, [userIsLoggedIn]);

    React.useEffect(() => {
        getCurrentUserUid((user: string) => {
            setUserIsLoggedIn(user !== null);
        });
    }, []);

    const isSuccessfullyLoggedIn = () => {
        return accessLevel === 'beta_approved' && userIsLoggedIn;
    };

    let [fontsLoaded] = useFonts({
        Poppins_400Regular_Italic,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return (
        <Screen>
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{ flex: 1 }}>
                <NavigationContainer linking={linking} fallback={<LoadingPage />}>
                    {isSuccessfullyLoggedIn() ? loaded ? <SecureMainStack /> : <LoadingPage /> : <InsecureMainStack />}
                </NavigationContainer>
            </SafeAreaView>
        </Screen>
    );
};
