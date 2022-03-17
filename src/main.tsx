import React from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { getAccessLevel } from 'src/redux/user/GlobalState';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { SecureMainStack } from 'src/components/home/SecureMainStack';
import { InsecureMainStack } from 'src/components/home/InsecureMainStack';
import ProfileController from 'src/controller/profile/ProfileController';
import { Screen } from 'src/components/common/Screen';
import { useAppSelector } from 'src/redux/Hooks';
import SafeAreaView from 'react-native-safe-area-view';

const linking: LinkingOptions<RootStackParamList> = {
    prefixes: ['https://embtr.com', 'embtr://'],
    config: {
        screens: {
            LandingPage: '',
            Dashboard: {
                screens: {
                    CurrentUserTab: {
                        screens: {
                            Profile: "profile",
                            UserSettings: "settings",
                            PillarsConfiguration: "configure"
                        }
                    },
                    TimelineTab: {
                        screens: {
                            UserSearch: "search",
                            Timeline: "timeline",
                            UserProfile: "user",
                            TimelineComments: {
                                path: "timeline/:id/comments",
                                parse: {
                                    id: (id) => id,
                                },
                                //                                  stringify: {
                                //                                    id: (id) => id.replace(/^user-/, ''),
                                //                                  },
                            },
                            ChallengeComments: {
                                path: "challenge/:id/comments",
                                parse: {
                                    id: (id) => id,
                                },
                                //                                  stringify: {
                                //                                    id: (id) => id.replace(/^user-/, ''),
                                //                                  },
                            },
                            Notifications: "notifications",
                        }
                    }
                }
            },
            About: "about",
            ReleaseNotes: "releaseNotes",
            Contact: "contact",
            Logout: "logout"
        }
    },
};

export const Main = () => {
    const accessLevel = useAppSelector(getAccessLevel);
    const [userIsLoggedIn, setUserIsLoggedIn] = React.useState<boolean | null>(null);

    //TODO - only do this on very first login
    React.useEffect(() => {
        ProfileController.registerInitialProfileUpdateListener();
    }, []);

    React.useEffect(() => {
        getCurrentUserUid((user: string) => {
            setUserIsLoggedIn(user !== null);
        });
    }, []);

    const isSuccessfullyLoggedIn = () => {
        return accessLevel === "beta_approved" && userIsLoggedIn;
    }

    return (
        <Screen>
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{ flex: 1 }}>
                <NavigationContainer linking={linking} fallback={<LoadingPage />}>
                    {isSuccessfullyLoggedIn() ? <SecureMainStack /> : <InsecureMainStack />}
                </NavigationContainer>
            </SafeAreaView>
        </Screen>
    );
};