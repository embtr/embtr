import * as React from 'react';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import { PostDetails } from 'src/components/common/comments/PostDetails';
import StoryController from 'src/controller/timeline/story/StoryController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserPostBody } from 'src/components/common/comments/UserPostBody';
import { StackNavigationProp } from '@react-navigation/stack';
import { Comment } from 'src/controller/timeline/TimelineController';
import { addTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';
import { useAppDispatch } from 'src/redux/Hooks';
import { UserPost } from 'resources/schema';

export const UserPostDetails = () => {
    const { colors } = useTheme();

    const route = useRoute<RouteProp<TimelineTabScreens, 'UserPostDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const [userPost, setUserPost] = React.useState<UserPost>();

    const fetch = async () => {
        const userPost = await StoryController.getViaApi(route.params.id);
        setUserPost(userPost);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetch();
        }, [])
    );

    const userIsPostOwner = userPost?.user?.uid === getAuth().currentUser?.uid;

    const submitComment = async (text: string, taggedUsers: UserProfileModel[]) => {
        if (!userPost?.id) {
            return;
        }

        await StoryController.addCommentViaApi(userPost.id, text);
        fetch();
    };

    const deleteComment = async (comment: Comment) => {
        if (!userPost?.id) {
            return;
        }

        await StoryController.deleteCommentViaApi(comment);
        fetch();
    };

    const navigateToEdit = () => {
        if (!userPost?.id) {
            return;
        }

        if (!userIsPostOwner) {
            return;
        }

        navigation.navigate('EditUserPostDetails', { id: userPost.id });
    };

    const deletePost = () => {
        //if (userIsPostOwner && storyModel) {
        //    Alert.alert('Delete Post', 'Are you sure you want to delete this post? This cannot be undone.', [
        //        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        //        {
        //            text: 'I am sure. Delete it.',
        //            onPress: async () => {
        //                await StoryController.delete(storyModel);
        //                navigation.navigate('Timeline');
        //            },
        //        },
        //    ]);
        //}
    };

    const dispatch = useAppDispatch();

    const onLike = async () => {
        if (!userPost?.id) {
            return;
        }

        await StoryController.addLikeViaApi(userPost.id);
        dispatch(addTimelineCardRefreshRequest(userPost.id));
        fetch();
    };

    if (!userPost) {
        return <View />;
    }

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: colors.background }}>
            <PostDetails
                type={'Post'}
                author={userPost.user!}
                added={userPost.createdAt ?? new Date()}
                likes={userPost.likes ?? []}
                comments={userPost.comments ?? []}
                onLike={onLike}
                submitComment={submitComment}
                deleteComment={deleteComment}
                onEdit={navigateToEdit}
                onDelete={deletePost}
            >
                <UserPostBody title={userPost.title ?? ''} post={userPost.body ?? ''} images={userPost.images ?? []} />
            </PostDetails>
        </View>
    );
};
