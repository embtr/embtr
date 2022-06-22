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
import NotificationController, { getUnreadNotificationCount, NotificationModel } from 'src/controller/notification/NotificationController';
import { getAuth } from 'firebase/auth';

export const Timeline = () => {
    const { colors } = useTheme();

    const card = {
        width: '100%',
        paddingTop: 10,
        paddingLeft: 10,
        paddingRight: 10
    }

    const cardShadow = {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 1,
        elevation: 5
    }

    const challengeShadow = {
        shadowColor: 'orange',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: .8,
        shadowRadius: 4,
        elevation: 5,
    }

    const [timelineEntries, setTimelineEntries] = React.useState<TimelinePostModel[]>([]);
    const [timelineViews, setTimelineViews] = React.useState<JSX.Element[]>([]);
    const [timelineProfiles, setTimelineProfiles] = React.useState<Map<string, UserProfileModel>>(new Map<string, UserProfileModel>());
    const [notifications, setNotifications] = React.useState<NotificationModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            TimelineController.getTimelinePosts(setTimelineEntries);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            NotificationController.getNotifications(getAuth().currentUser!.uid, setNotifications);
        }, [])
    );

    React.useEffect(() => {
        let uids: string[] = [];
        timelineEntries.forEach(timelineEntry => {
            if (!uids.includes(timelineEntry.uid)) {
                uids.push(timelineEntry.uid);
            }
        });

        ProfileController.getProfiles(uids, (profiles: UserProfileModel[]) => {
            let profileMap = new Map<string, UserProfileModel>();
            profiles.forEach(profile => {
                profileMap.set(profile.uid!, profile);
            });

            setTimelineProfiles(profileMap);
        });

    }, [timelineEntries]);

    const createStoryView = (timelineEntry: TimelinePostModel) => {
        const profile = timelineProfiles.get(timelineEntry.uid);
        if (profile) {
            return <View key={timelineEntry.id} style={[card, cardShadow]}>
                <UserTextCard userProfileModel={profile} story={timelineEntry} />
            </View>;
        }

        return <View />;
    };

    const createChallengeView = (timelineEntry: TimelinePostModel) => {
        return <View key={timelineEntry.id} style={[card, challengeShadow]}>
            <EmbtrTextCard challengeModel={timelineEntry as ChallengeModel1} />
        </View>
    };

    const createTimelineView = (timelineEntry: TimelinePostModel) => {
        switch (timelineEntry.type) {
            case "STORY":
                return createStoryView(timelineEntry);

            case "CHALLENGE":
                return createChallengeView(timelineEntry);

            default:
                return <View />

        }
    };

    React.useEffect(() => {
        let views: JSX.Element[] = [];
        timelineEntries.forEach(timelineEntry => {
            const view: JSX.Element = createTimelineView(timelineEntry);
            views.push(view);
        });

        setTimelineViews(views);
    }, [timelineProfiles]);

    const unreadNotificationCount = getUnreadNotificationCount(notifications);

    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    return (
        <Screen>
            <Banner
                name="Timeline"
                leftIcon={'people-outline'}
                leftRoute={'UserSearch'}
                innerLeftIcon={'add-outline'}
                innerLeftCallback={() => { navigation.navigate('CreateTimelineStory') }}
                rightIcon={'notifications-outline'}
                rightRoute={'Notifications'}
                rightIconNotificationCount={unreadNotificationCount}
            />
            <ScrollView keyboardShouldPersistTaps={'handled'} style={{ backgroundColor: colors.scroll_background }}>
                <View style={{ flex: 1 }}>
                    {timelineViews}
                </View>
            </ScrollView>
        </Screen>
    );
}