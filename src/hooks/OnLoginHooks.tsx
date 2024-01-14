import { UserCustomHooks } from 'src/controller/user/UserController';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { MetadataCustomHooks } from 'src/controller/metadata/MetadataController';
import React from 'react';
import Constants from 'expo-constants';
import { UpdateUtility } from 'src/util/updates/UpdateUtility';
import { useAppSelector } from 'src/redux/Hooks';
import { getAcknowledgedVersion } from 'src/redux/user/GlobalState';

export namespace OnLoginHooks {
    export const useOnLogin = () => {
        const navigation = useEmbtrNavigation();

        const currentUser = UserCustomHooks.useCurrentUser();
        const termsVersion = MetadataCustomHooks.useLatestTermsVersion();

        const minimumAppVersion = MetadataCustomHooks.useMinimumAppVersion();
        const latestAppVersion = MetadataCustomHooks.useLatestAppVersion();
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
            console.log(currentVersion, minimumAppVersion, latestAppVersion, acknowledgeVersion);
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

            console.log(softUpdateAvailable, softUpdateAcknowledged, hardUpdateAvailable);

            if (hardUpdateAvailable) {
                console.log('Hard update available, navigating to update modal');
                navigation.navigate(Routes.UPDATE_AVAILABLE_MODAL);
                return;
            }

            if (softUpdateAvailable && !softUpdateAcknowledged) {
                console.log('Hard update available, navigating to update modal');
                navigation.navigate(Routes.UPDATE_AVAILABLE_MODAL);
                return;
            }
        }
    };
}
