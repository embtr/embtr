import React from 'react';
import { LinkingOptions, NavigationContainer } from '@react-navigation/native';
import { useAppSelector } from 'src/redux/hooks';
import { getAccessLevel } from 'src/redux/user/GlobalState';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import UserController from 'src/controller/user/UserController';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { SecureMainStack } from 'src/components/home/SecureMainStack';
import { InsecureMainStack } from 'src/components/home/InsecureMainStack';

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
                            UserSettings: "settings"
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

    React.useEffect(() => {
        UserController.registerProfileUpdateListener();
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
        <NavigationContainer linking={linking} fallback={<LoadingPage />}>
            {isSuccessfullyLoggedIn() ? <SecureMainStack /> : <InsecureMainStack />}
        </NavigationContainer>
    );
};