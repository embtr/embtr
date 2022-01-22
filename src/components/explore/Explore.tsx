import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { getAuth } from 'firebase/auth';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { EmbtrTextCard } from 'src/components/common/timeline/EmbtrTextCard';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { useFocusEffect } from '@react-navigation/native';
import ExploreController, { ChallangeModel } from 'src/controller/explore/ExploreController';

export const Explore = () => {
    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);
    const [challenges, setChallenges] = React.useState<ChallangeModel[]>([]);

    React.useEffect(() => {
        const uid = getAuth().currentUser?.uid;
        if (uid) {
            ProfileController.getProfile(uid, (profile: UserProfileModel) => {
                setUserProfileModel(profile);
            });
        }
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            ExploreController.getChallenges(setChallenges);
        }, [])
    );

    let challengeViews: JSX.Element[] = [];
    challenges.forEach(challenge => {
        challengeViews.push(
            <View key={challenge.title} style={{ marginTop: 5 }}>
                <EmbtrTextCard challengeModel={challenge} />
            </View>
        );
    });

    return (
        <Screen>
            <Banner name="Explore" />
            <ScrollView>
                <View style={{ flex: 1 }}>
                    { challengeViews }
                </View>
            </ScrollView>
        </Screen>
    );
}