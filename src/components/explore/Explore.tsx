import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { getAuth } from 'firebase/auth';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { EmbtrTextCard } from 'src/components/common/timeline/EmbtrTextCard';
import { useFocusEffect } from '@react-navigation/native';
import ExploreController, { ChallangeModel } from 'src/controller/explore/ExploreController';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const Explore = () => {
    const { colors } = useTheme();
    
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
            <View key={challenge.title} style={{ marginBottom: 7.5, backgroundColor: colors.background }}>
                <EmbtrTextCard challengeModel={challenge} userProfileModel={userProfileModel!} />
            </View>
        );
    });

    return (
        <Screen>
            <Banner name="Explore" />
            <ScrollView style={{backgroundColor:colors.background_secondary}}>
                <View style={{ flex: 1 }}>
                    {challengeViews}
                </View>
            </ScrollView>
        </Screen>
    );
}