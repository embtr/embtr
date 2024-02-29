import React from 'react';
import { DarkTheme, NavigationContainer } from '@react-navigation/native';
import { registerAuthStateListener } from 'src/session/CurrentUserProvider';
import { LoadingPage } from 'src/components/landing/LoadingPage';
import { SecureMainStack } from 'src/components/home/SecureMainStack';
import { InsecureMainStack } from 'src/components/home/InsecureMainStack';
import { Screen } from 'src/components/common/Screen';
import SafeAreaView from 'react-native-safe-area-view';
import { Roboto_500Medium } from '@expo-google-fonts/roboto';
import {
    useFonts,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import UserController from './controller/user/UserController';
import { resetToDefault, setCurrentUser } from 'src/redux/user/GlobalState';
import { useAppDispatch } from 'src/redux/Hooks';
import { ModalContainingComponent } from './components/common/modal/ModalContainingComponent';
import { ConfettiView } from './components/common/animated_view/ConfettiView';
import { DropDownAlert } from './components/common/drop_down_alert/DropDownAlert';
import { QuickAddModal } from './components/home/tabmenu/QuickAddModal';
import { LoadingOverlay } from './components/common/loading/LoadingOverlay';
import { RemoveHabitModal } from './components/plan/habit/RemoveHabitModal';
import { UpdatePlannedTaskModal } from './components/plan/UpdatePlannedTaskModal';
import { EditHabitModal } from './components/plan/habit/EditHabitModal';
import { linking } from 'src/navigation/Linking';
import firebaseApp from './firebase/Firebase';
import { EnvironmentIndicator } from 'src/components/debug/EnvironmentIndicator';
//import { RevenueCat } from './controller/revenuecat/RevenueCat';

//start up firebase connection
firebaseApp;

enum LoginState {
    LOGGED_IN,
    LOGGED_OUT,
    LOADING,
}

export const Main = () => {
    const dispatch = useAppDispatch();
    const [loggedIn, setLoggedIn] = React.useState(LoginState.LOADING);

    let [fontsLoaded] = useFonts({
        Poppins_400Regular_Italic,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Roboto_500Medium,
    });

    //RevenueCat.useConfigure();

    React.useEffect(() => {
        // reset all state
        dispatch(resetToDefault());

        const loginUnsubscribe = registerAuthStateListener(async (firebaseUser) => {
            if (firebaseUser) {
                const loggedInUser = await UserController.loginUser();
                if (loggedInUser) {
                    setLoggedIn(LoginState.LOGGED_IN);
                    //RevenueCat.login();
                    dispatch(setCurrentUser(loggedInUser));
                }
            } else {
                setLoggedIn(LoginState.LOGGED_OUT);
                //RevenueCat.logout();
                dispatch(setCurrentUser({}));
            }
        });

        return () => {
            loginUnsubscribe();
        };
    }, []);

    let view: JSX.Element =
        loggedIn === LoginState.LOGGED_IN ? <SecureMainStack /> : <InsecureMainStack />;

    return (
        <Screen>
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{ flex: 1 }}>
                <NavigationContainer theme={DarkTheme} linking={linking}>
                    {/* TOP LEVEL COMPONENTS */}
                    <EnvironmentIndicator />
                    <ModalContainingComponent />
                    <QuickAddModal />
                    <ConfettiView />
                    <DropDownAlert />
                    <LoadingOverlay />
                    <RemoveHabitModal />
                    <UpdatePlannedTaskModal />
                    <EditHabitModal />
                    {!fontsLoaded || loggedIn === LoginState.LOADING ? <LoadingPage /> : view}
                </NavigationContainer>
            </SafeAreaView>
        </Screen>
    );
};
