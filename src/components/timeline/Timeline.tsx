import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { getAuth } from 'firebase/auth';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';

export const Timeline = () => {
    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);

    React.useEffect(() => {
        const uid = getAuth().currentUser?.uid;
        if (uid) {
            ProfileController.getProfile(uid, (profile: UserProfileModel) => {
                setUserProfileModel(profile);
            });
        }
    }, []);
    return (
        <Screen>
            <Banner name="Timeline" leftIcon={'search-circle-outline'} leftRoute='UserSearch' />
            <ScrollView style={{ marginTop: 20 }}>
                <View style={{ flex: 1 }}>
                <View style={{ marginTop: 5 }}>
                        {userProfileModel && <UserTextCard userProfileModel={userProfileModel} title='Pillar System - Yes Please!' body={"Starting the Pillar System has completed transformed every aspect of my day. I went from chasing success to living it."} />}
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}