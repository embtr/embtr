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
import { SafeAreaView } from 'react-native';
import { useAppSelector } from 'src/redux/Hooks';

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
                            PillarConfiguration: "configure"
                        }
                    },
                    TimelineTab: {
                        screens: {
                            UserSearch: "search",
                            Timeline: "timeline",
                            UserProfile: "user"
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
            <SafeAreaView style={{ flex: 1 }}>
                <NavigationContainer linking={linking} fallback={<LoadingPage />}>
                    {isSuccessfullyLoggedIn() ? <SecureMainStack /> : <InsecureMainStack />}
                </NavigationContainer>
            </SafeAreaView>
        </Screen>
    );
};