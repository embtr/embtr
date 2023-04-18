import React from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { registerAuthStateListener } from 'src/session/CurrentUserProvider';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { SecureMainStack } from 'src/components/home/SecureMainStack';
import { InsecureMainStack } from 'src/components/home/InsecureMainStack';
import { Screen } from 'src/components/common/Screen';
import SafeAreaView from 'react-native-safe-area-view';
import { LogBox, View } from 'react-native';
import PushNotificationController from 'src/controller/notification/PushNotificationController';
import { useFonts, Poppins_400Regular, Poppins_400Regular_Italic, Poppins_500Medium, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import UserController from './controller/user/UserController';
import { User } from 'firebase/auth';
import { getFirebaseConnection } from './firebase/firestore/ConnectionProvider';

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
    const [user, setUser] = React.useState<User | undefined>(undefined);
    const [userIsLoggedIn, setUserIsLoggedIn] = React.useState<boolean>(false);

    getFirebaseConnection('', '');

    LogBox.ignoreAllLogs();
    registerAuthStateListener(setUser);

    const createUserIfNew = async (user: User) => {
        if (!user.uid || !user.email) {
            return false;
        }

        const successfulLogin = await UserController.createUserIfNew(user.uid);
        console.log('successful login: ' + successfulLogin);
        return successfulLogin;
    };

    React.useEffect(() => {
        const blockingLoad = async () => {
            if (!user) {
                return;
            }

            const result = await createUserIfNew(user);
            //PushNotificationController.registerUpdatePostNotificationTokenListener();

            setUserIsLoggedIn(result);
        };

        blockingLoad();
    }, [user]);

    const isEmailVerified = () => {
        return user?.emailVerified;
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

    console.log('Main.tsx: userIsLoggedIn: ' + userIsLoggedIn + ', isEmailVerified: ' + isEmailVerified());

    return (
        <Screen>
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{ flex: 1 }}>
                <NavigationContainer linking={linking} fallback={<LoadingPage />}>
                    {isEmailVerified() && userIsLoggedIn && <SecureMainStack />}
                    {(!isEmailVerified() || !userIsLoggedIn) && <InsecureMainStack />}
                </NavigationContainer>
            </SafeAreaView>
        </Screen>
    );
};
