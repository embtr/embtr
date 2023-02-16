import React from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { setCurrentUser } from 'src/redux/user/GlobalState';
import { getCurrentUserUid, registerAuthStateListener } from 'src/session/CurrentUserProvider';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { SecureMainStack } from 'src/components/home/SecureMainStack';
import { InsecureMainStack } from 'src/components/home/InsecureMainStack';
import ProfileController from 'src/controller/profile/ProfileController';
import { Screen } from 'src/components/common/Screen';
import { useAppDispatch } from 'src/redux/Hooks';
import SafeAreaView from 'react-native-safe-area-view';
import { LogBox, View } from 'react-native';
import PushNotificationController from 'src/controller/notification/PushNotificationController';
import { useFonts, Poppins_400Regular, Poppins_400Regular_Italic, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import UserController from './controller/user/UserController';
import { User, UserCredential, getAuth } from 'firebase/auth';

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
                            GoalDetails: {
                                path: 'goal/:uid/:id/comments',
                                parse: {
                                    id: (id) => id,
                                    source: 'timeline',
                                    uid: (uid) => uid,
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
    const [user, setUser] = React.useState<User | undefined>(undefined);
    const [loaded, setLoaded] = React.useState<boolean>(false);

    const dispatch = useAppDispatch();

    LogBox.ignoreAllLogs();
    registerAuthStateListener(setUser);

    const createUserIfNew = async (user: User) => {
        if (user.uid && user.email) {
            await UserController.createUser(user.uid, user.email);
        }
    };

    React.useEffect(() => {
        const blockingLoad = async () => {
            await createUserIfNew(user!);

            let currentUser = await UserController.getCurrentUser();

            ProfileController.registerInitialProfileUpdateListener();
            PushNotificationController.registerUpdatePostNotificationTokenListener();

            currentUser = await UserController.getCurrentUser();
            dispatch(setCurrentUser(currentUser));

            setLoaded(true);
        };
        if (isLoggedIn()) {
            blockingLoad();
        } else {
            dispatch(setCurrentUser(undefined));
        }
    }, [user]);

    const isLoggedIn = () => {
        return user;
    };

    const isEmailVerified = () => {
        return isLoggedIn() && user?.emailVerified;
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
                    {isEmailVerified() ? loaded ? <SecureMainStack /> : <LoadingPage /> : <InsecureMainStack />}
                </NavigationContainer>
            </SafeAreaView>
        </Screen>
    );
};
