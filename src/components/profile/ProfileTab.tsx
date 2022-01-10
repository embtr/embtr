import * as React from 'react';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { CurrentUserProfile } from 'src/components/profile/CurrentUserProfle';
import { Screen } from 'src/components/common/screen';
import { SafeAreaView } from 'react-native';


export const ProfileTab = () => {

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);

    React.useEffect(() => {
        ProfileController.getProfile(getCurrentUserUid()!, (profile: UserProfileModel) => {
            setUserProfileModel(profile);
        });
    }, []);

    return (<Screen>
        <SafeAreaView>
            {userProfileModel && <CurrentUserProfile userProfileModel={userProfileModel} />}
        </SafeAreaView>
    </Screen>)

}