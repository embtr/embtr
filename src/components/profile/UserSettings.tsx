import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ThemeToggle } from 'src/components/theme/ThemeToggle';
import { getAuth } from 'firebase/auth';
import { NotificationsToggle } from 'src/components/settings/NotificationsToggle';
import { SettingsButtonElement } from 'src/components/settings/SettingsButtonElement';
import { SettingsVersion } from 'src/components/settings/SettingsVersion';
import { EditProfileSettingsButton } from 'src/components/settings/EditProfileSettingsButton';
import { SettingsFeedback } from 'src/components/settings/SettingsFeedback';
import UserController from 'src/controller/user/UserController';
import { SettingsAccount } from '../settings/SettingsAccount';
import { SettingsMembership } from '../settings/SettingsMembership';
import { useAppDispatch } from 'src/redux/Hooks';
import {
    INITIAL_STATE,
    setCurrentUser,
    setCurrentlySelectedPlannedDay,
    setTodaysPlannedDay,
    setUserProfileImage,
} from 'src/redux/user/GlobalState';

export const UserSettings = () => {
    const dispatch = useAppDispatch();

    return (
        <Screen>
            <Banner name="Settings" leftIcon={'arrow-back'} leftRoute="BACK" />

            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <ThemeToggle />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <NotificationsToggle />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <EditProfileSettingsButton />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsAccount />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsMembership />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsButtonElement
                        text={'Sign Out'}
                        icon={'exit-outline'}
                        onPress={async () => {
                            await UserController.refreshToken();
                            dispatch(setCurrentUser(INITIAL_STATE.currentUser));
                            dispatch(setTodaysPlannedDay(INITIAL_STATE.todaysPlannedDay));
                            dispatch(setUserProfileImage(INITIAL_STATE.userProfileImage));
                            dispatch(
                                setCurrentlySelectedPlannedDay(
                                    INITIAL_STATE.currentlySelectedPlannedDay
                                )
                            );
                            getAuth().signOut();
                        }}
                    />
                </View>

                <View style={{ paddingTop: 7.5, width: '98%', alignItems: 'center' }}>
                    <SettingsVersion />
                </View>
            </View>
        </Screen>
    );
};
