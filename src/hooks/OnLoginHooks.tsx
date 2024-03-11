import { UserCustomHooks } from 'src/controller/user/UserController';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { MetadataCustomHooks } from 'src/controller/metadata/MetadataController';
import Constants from 'expo-constants';
import { UpdateUtility } from 'src/util/updates/UpdateUtility';
import { useAppSelector } from 'src/redux/Hooks';
import { getAcknowledgedVersion } from 'src/redux/user/GlobalState';
import PushNotificationController from 'src/controller/notification/PushNotificationController';
import { isIosApp } from 'src/util/DeviceUtil';
import { UserPropertyUtil } from 'src/util/user/UserPropertyUtil';
import { UserPropertyService } from 'src/service/UserPropertyService';

const handleLoginModals = () => {
    const navigation = useEmbtrNavigation();

    const currentUser = UserCustomHooks.useCurrentUser();
    const termsVersion = MetadataCustomHooks.useLatestTermsVersion();

    const minimumIosVersion = MetadataCustomHooks.useMinimumIosVersion();
    const minimumAndroidVersion = MetadataCustomHooks.useMinimumAndroidVersion();
    const latestIosVersion = MetadataCustomHooks.useLatestIosVersion();
    const latestAndroidVersion = MetadataCustomHooks.useLatestAndroidVersion();
    const minimumAppVersion = isIosApp() ? minimumIosVersion : minimumAndroidVersion;
    const latestAppVersion = isIosApp() ? latestIosVersion : latestAndroidVersion;

    const currentVersion = Constants.expoConfig?.version;
    const acknowledgeVersion = useAppSelector(getAcknowledgedVersion);

    if (currentUser.data && !currentUser.data?.accountSetup) {
        navigation.navigate(Routes.NEW_USER_PROFILE_POPULATION);
        return;
    }

    if (currentUser.data && termsVersion.data) {
        const userTermsVersion = currentUser.data.termsVersion ?? 0;
        const termsVersionNumber = Number(termsVersion.data);

        if (userTermsVersion < termsVersionNumber) {
            navigation.navigate(Routes.TERMS_APPROVAL_MODAL);
            return;
        }
    }

    if (currentVersion && minimumAppVersion.data && latestAppVersion.data) {
        const softUpdateAvailable = UpdateUtility.updateIsAvailable(
            currentVersion,
            latestAppVersion.data
        );
        const softUpdateAcknowledged = !UpdateUtility.updateIsAvailable(
            acknowledgeVersion,
            latestAppVersion.data
        );
        const hardUpdateAvailable = UpdateUtility.updateIsAvailable(
            currentVersion,
            minimumAppVersion.data
        );

        if (hardUpdateAvailable) {
            navigation.navigate(Routes.UPDATE_AVAILABLE_MODAL);
            return;
        }

        if (softUpdateAvailable && !softUpdateAcknowledged) {
            navigation.navigate(Routes.UPDATE_AVAILABLE_MODAL);
            return;
        }
    }
};

const handlePushNotificationToken = () => {
    PushNotificationController.registerPushNotificationToken();
};

const handleTimeZone = () => {
    const currentUser = UserCustomHooks.useCurrentUser();
    if (!currentUser.data) {
        return;
    }

    const currentTimeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const currentUserTimeZone = UserPropertyUtil.getTimeZone(currentUser.data);
    if (currentUserTimeZone === currentTimeZoneName) {
        return;
    }

    console.log('ADDING TIMEZONE', currentTimeZoneName);
    UserPropertyService.createTimeZone(currentTimeZoneName);

    // todo - refresh user data
};

export namespace OnLoginHooks {
    export const useOnLogin = () => {
        handleLoginModals();
        handlePushNotificationToken();
        handleTimeZone();
    };
}
