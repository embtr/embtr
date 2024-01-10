import React, { Dispatch } from 'react';
import { DarkTheme, LinkingOptions, NavigationContainer } from '@react-navigation/native';
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
    resetToDefault,
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
import { LoadingOverlay } from './components/common/loading/LoadingOverlay';
import PlannedDayController from './controller/planning/PlannedDayController';
import { RemoveHabitModal } from './components/plan/habit/RemoveHabitModal';
import { UpdatePlannedTaskModal } from './components/plan/UpdatePlannedTaskModal';
import { EditHabitModal } from './components/plan/habit/EditHabitModal';
import { linking } from 'src/navigation/Linking';

export const Main = () => {
    const dispatch = useAppDispatch();

    const currentUser = useAppSelector(getCurrentUser);
    const userIsLoggedIn = Object.keys(currentUser ?? {}).length !== 0;

    React.useEffect(() => {
        const loginUnsubscribe = registerAuthStateListener(async (firebaseUser) => {
            if (!!firebaseUser) {
                const loggedInUser = await UserController.loginUser();
                if (loggedInUser) {
                    dispatch(setCurrentUser(loggedInUser));
                }
            } else {
                dispatch(setCurrentUser({}));
            }
        });

        return () => {
            loginUnsubscribe();
        };
    }, []);

    getFirebaseConnection('', '');

    let [fontsLoaded] = useFonts({
        Poppins_400Regular_Italic,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Roboto_500Medium,
    });

    if (!fontsLoaded) {
        return <LoadingPage />;
    }

    // todo register push notifications

    let view: JSX.Element = userIsLoggedIn ? <SecureMainStack /> : <InsecureMainStack />;


    return (
        <Screen>
            <SafeAreaView forceInset={{ bottom: 'never' }} style={{ flex: 1 }}>
                <NavigationContainer theme={DarkTheme} linking={linking} fallback={<LoadingPage />}>
                    {/* TOP LEVEL COMPONENTS */}
                    <ModalContainingComponent />
                    <QuickAddModal />
                    <ConfettiView />
                    <DropDownAlert />
                    <LoadingOverlay />
                    <RemoveHabitModal />
                    <UpdatePlannedTaskModal />
                    <EditHabitModal />
                    {/* END TOP LEVEL COMPONENTS */}
                    {view}
                </NavigationContainer>
            </SafeAreaView>
        </Screen>
    );
};
