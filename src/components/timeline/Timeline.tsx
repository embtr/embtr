import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { UserTextCard } from 'src/components/common/timeline/UserTextCard';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useTheme } from 'src/components/theme/ThemeProvider';
import TimelineController, { TimelinePostModel } from 'src/controller/timeline/TimelineController';
import { EmbtrTextCard } from 'src/components/common/timeline/EmbtrTextCard';
import { ChallengeModel1 } from 'src/controller/timeline/challenge/ChallengeController';

export const Timeline = () => {
    const { colors } = useTheme();

    const card = {
        backgroundColor: colors.background,
        width: '100%',
        marginBottom: 4,
        marginTop: 4,
    }

    const [timelineEntries, setTimelineEntries] = React.useState<TimelinePostModel[]>([]);
    const [timelineViews, setTimelineViews] = React.useState<JSX.Element[]>([]);
    const [timelineProfiles, setTimelineProfiles] = React.useState<Map<string, UserProfileModel>>(new Map<string, UserProfileModel>());

    useFocusEffect(
        React.useCallback(() => {
            TimelineController.getTimelinePosts(setTimelineEntries);
        }, [])
    );

    React.useEffect(() => {
        let uids: string[] = [];
        timelineEntries.forEach(timelineEntry => {
            uids.push(timelineEntry.uid);
        });

        ProfileController.getProfiles(uids, (profiles: UserProfileModel[]) => {
            let profileMap = new Map<string, UserProfileModel>();
            profiles.forEach(profile => {
                profileMap.set(profile.uid!, profile);
            });

            setTimelineProfiles(profileMap);
        });

    }, [timelineEntries]);

    React.useEffect(() => {
        let views: JSX.Element[] = [];
        timelineEntries.forEach(timelineEntry => {
            const profile = timelineProfiles.get(timelineEntry.uid);
            if (profile) {
                views.push(
                    <View key={timelineEntry.id} style={[card]}>
                        { timelineEntry.type === "STORY" && <UserTextCard userProfileModel={profile} storyModel={timelineEntry} /> }
                        { timelineEntry.type === "CHALLENGE" && <EmbtrTextCard challengeModel={timelineEntry as ChallengeModel1} /> }
                    </View>
                );
            }
        });

        setTimelineViews(views);
    }, [timelineProfiles]);

    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    return (
        <Screen>
            <Banner name="Timeline" leftIcon={'people-outline'} leftRoute='UserSearch' innerLeftIcon={'add-outline'} innerLeftCallback={() => { navigation.navigate('CreateTimelineStory') }} />
            <ScrollView keyboardShouldPersistTaps={'handled'} style={{ backgroundColor: colors.background_secondary }}>
                <View style={{ flex: 1 }}>
                    {timelineViews}
                </View>
            </ScrollView>
        </Screen>
    );
}