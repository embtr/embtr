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
import {
    getCurrentUser,
    getFirePoints,
    resetToDefault,
    setCurrentUser,
    setGlobalLoading,
} from 'src/redux/user/GlobalState';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
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
import { RevenueCat } from 'src/controller/revenuecat/RevenueCat';
import { RevenueCatProvider } from './controller/revenuecat/RevenueCatProvider';
import { TutorialIslandSecureMainStack } from './components/home/TutorialIslandSecureMainStack';
import { TutorialIslandMainComponents } from './components/tutorial/TutorialIslandMainComponents';
import { UserPropertyUtil } from './util/UserPropertyUtil';
import { WebSocketCustomHooks, WebSocketService } from './service/WebSocketService';
import { PointsView } from './components/common/animated_view/PointsView';
import { Button } from 'react-native';

//start up firebase connection
firebaseApp;

enum LoginState {
    LOGGED_IN = 'LOGGED_IN',
    LOGGED_OUT = 'LOGGED_OUT',
    LOADING = 'LOADING',
}

export const Main = () => {
    const revenueCat: RevenueCat = RevenueCatProvider.get();

    const dispatch = useAppDispatch();
    const [loggedInState, setLoggedInState] = React.useState(LoginState.LOADING);

    const currentUser = useAppSelector(getCurrentUser);
    const tutorialIslandComplete = UserPropertyUtil.hasStartedTutorialIsland(currentUser);

    //needed to register the user with the websocket
    WebSocketCustomHooks.useWebSocket();

    let [fontsLoaded] = useFonts({
        Poppins_400Regular_Italic,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Roboto_500Medium,
    });

    React.useEffect(() => {
        revenueCat.configure();

        // reset all state
        dispatch(resetToDefault());

        const loginUnsubscribe = registerAuthStateListener(async (firebaseUser) => {
            if (firebaseUser) {
                const loggedInUser = await UserController.loginUser();
                if (loggedInUser) {
                    setLoggedInState(LoginState.LOGGED_IN);

                    revenueCat.login();

                    dispatch(setCurrentUser(loggedInUser));
                    dispatch(setGlobalLoading(false));

                    WebSocketService.connect(firebaseUser);
                }
            } else {
                setLoggedInState(LoginState.LOGGED_OUT);
                dispatch(setCurrentUser({}));
            }
        });

        return () => {
            loginUnsubscribe();
        };
    }, []);

    let view: JSX.Element =
        loggedInState === LoginState.LOGGED_IN ? (
            tutorialIslandComplete ? (
                <SecureMainStack />
            ) : (
                <TutorialIslandSecureMainStack />
            )
        ) : (
            <InsecureMainStack />
        );

    return (
        <Screen>
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{ flex: 1 }}>
                <NavigationContainer theme={DarkTheme} linking={linking}>
                    {/* TOP LEVEL COMPONENTS */}
                    <EnvironmentIndicator />
                    <ModalContainingComponent />
                    <QuickAddModal />
                    <ConfettiView />
                    <PointsView />
                    <DropDownAlert />
                    <LoadingOverlay />
                    <RemoveHabitModal />
                    <UpdatePlannedTaskModal />
                    <EditHabitModal />
                    <TutorialIslandMainComponents />
                    {!fontsLoaded || loggedInState === LoginState.LOADING ? <LoadingPage /> : view}
                </NavigationContainer>
            </SafeAreaView>
        </Screen>
    );
};
