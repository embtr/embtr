import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { getAuth } from 'firebase/auth';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { EmbtrTextCard } from 'src/components/common/timeline/EmbtrTextCard';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';

export const Explore = () => {
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
            <Banner name="Explore" />
            <ScrollView style={{}}>
                <View style={{ flex: 1 }}>
                    <View style={{ marginTop: 5 }}>
                        <EmbtrTextCard title={'Challenge: Goggins - 4x4x48'} body={"embtr. is taking on Goggins 4x4x48 - and we want you to join us!"} />
                    </View>

                    <View style={{ marginTop: 5 }}>
                        {userProfileModel && <UserTextCard userProfileModel={userProfileModel} title='Pillar System - Yes Please!' body={"Starting the Pillar System has completed transformed every aspect of my day. I went from chasing success to living it."} />}
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
}