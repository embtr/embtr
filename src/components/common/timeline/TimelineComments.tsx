import * as React from 'react';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import { Comments } from 'src/components/common/comments/Comments';
import StoryController, { StoryModel } from 'src/controller/timeline/story/StoryController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import NotificationController, { NotificationType } from 'src/controller/notification/NotificationController';
import { View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserPostBody } from 'src/components/common/comments/UserPostBody';

export const TimelineComments = () => {
    const { colors } = useTheme();
    const route = useRoute<RouteProp<TimelineTabScreens, 'ChallengeComments'>>();

    const [storyModel, setStoryModel] = React.useState<StoryModel | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            StoryController.getStory(route.params.id, setStoryModel);
        }, [])
    );

    const submitComment = (text: string, taggedUsers: UserProfileModel[]) => {
        const user = getAuth().currentUser;
        if (storyModel?.id && user?.uid) {
            StoryController.addComment(storyModel.id, user.uid, text, () => {
                NotificationController.addNotifications(getAuth().currentUser!.uid, taggedUsers, NotificationType.TIMELINE_COMMENT, route.params.id);
                StoryController.getStory(route.params.id, setStoryModel);
            });
        }
    };

    if (storyModel) {
        return (
            <View style={{ width: '100%', height: '100%', backgroundColor: colors.background }}>
                <Comments
                    type={'Post'}
                    authorUid={storyModel.uid ? storyModel.uid : ''}
                    added={storyModel.added.toDate()}
                    comments={storyModel?.public.comments ? storyModel?.public.comments : []}
                    submitComment={submitComment}
                >
                    <UserPostBody title={storyModel?.data.title ? storyModel?.data.title : ''} post={storyModel.data.story} />
                </Comments>
            </View>
        );
    }

    return <View />;
};
