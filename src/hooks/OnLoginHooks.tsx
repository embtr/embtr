import { UserCustomHooks } from 'src/controller/user/UserController';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { MetadataCustomHooks } from 'src/controller/metadata/MetadataController';
import React from 'react';

export namespace OnLoginHooks {
    export const useOnLogin = () => {
        const navigation = useEmbtrNavigation();

        const currentUser = UserCustomHooks.useCurrentUser();
        const termsVersion = MetadataCustomHooks.useTermsVersion();

        if (currentUser.data && !currentUser.data?.accountSetup) {
            navigation.navigate(Routes.NEW_USER_PROFILE_POPULATION);
            return;
        }

        if (termsVersion.data) {
            const userTermsVersion = currentUser.data?.termsVersion ?? 0;
            const termsVersionNumber = Number(termsVersion.data);

            if (userTermsVersion < termsVersionNumber) {
                navigation.navigate(Routes.TERMS_APPROVAL_MODAL);
                return;
            }
        }

        // is there an update?
    };
}