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
import StoryController, { StoryModel } from 'src/controller/story/StoryController';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const Timeline = () => {
    const { colors } = useTheme();

    const card = {
        backgroundColor: colors.background,
        width: '100%',
        marginBottom: 4,
        marginTop: 4 ,
    }

    const shadowTopProp = {
        shadowColor: 'orange',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: .5,
        shadowRadius: 3.5,
    }

    const [timelineEntries, setTimelineEntries] = React.useState<StoryModel[]>([]);
    const [timelineViews, setTimelineViews] = React.useState<JSX.Element[]>([]);
    const [timelineProfiles, setTimelineProfiles] = React.useState<Map<string, UserProfileModel>>(new Map<string, UserProfileModel>());

    useFocusEffect(
        React.useCallback(() => {
            StoryController.getStories(setTimelineEntries);
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
                        <UserTextCard userProfileModel={profile} title={timelineEntry.data.title} body={timelineEntry.data.story} />
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