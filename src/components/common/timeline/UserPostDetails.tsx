import * as React from 'react';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import { PostDetails } from 'src/components/common/comments/PostDetails';
import StoryController from 'src/controller/timeline/story/StoryController';
import { Alert, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserPostBody } from 'src/components/common/comments/UserPostBody';
import { StackNavigationProp } from '@react-navigation/stack';
import { Comment, UserPost } from 'resources/schema';
import { useAppDispatch } from 'src/redux/Hooks';
import { addTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';
import { TimelinePostModel, UserProfileModel } from 'src/model/OldModels';
import { Screen } from '../Screen';
import { TimelineType } from 'resources/types/Types';
import { TimelineCard } from 'src/components/timeline/TimelineCard';

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

    if (!userPost) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    //TODO - finish migrating this over
    const userPostTimelinePost: TimelinePostModel = {
        user: userPost.user!,
        type: TimelineType.USER_POST,
        id: userPost.id!,
        sortDate: userPost?.createdAt!,
        comments: userPost?.comments ?? [],
        likes: userPost?.likes ?? [],
        images: userPost?.images ?? [],
        title: userPost?.title ?? '',
        body: userPost?.body ?? '',
        data: {
            userPost,
        },
    };

    const userIsPostOwner = userPost?.user?.uid === getAuth().currentUser?.uid;

    const submitComment = async (text: string, taggedUsers: UserProfileModel[]) => {
        if (!userPost?.id) {
            return;
        }

        await StoryController.addCommentViaApi(userPost.id, text);
        dispatch(addTimelineCardRefreshRequest('POST_' + userPost.id));
        fetch();
    };

    const deleteComment = async (comment: Comment) => {
        if (!userPost?.id) {
            return;
        }

        await StoryController.deleteCommentViaApi(comment);
        dispatch(addTimelineCardRefreshRequest('POST_' + userPost.id));
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
        if (!userPost?.id) {
            return;
        }

        if (!userIsPostOwner) {
            return;
        }

        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post? This cannot be undone.',
            [
                { text: 'Cancel', onPress: () => {}, style: 'cancel' },
                {
                    text: 'I am sure. Delete it.',
                    onPress: async () => {
                        await StoryController.deleteViaApi(userPost);
                        navigation.navigate('Timeline');
                    },
                },
            ]
        );
    };

    const dispatch = useAppDispatch();

    const onLike = async () => {
        if (!userPost?.id) {
            return;
        }

        await StoryController.addLikeViaApi(userPost.id);
        dispatch(addTimelineCardRefreshRequest('POST_' + userPost.id));
        fetch();
    };

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: colors.background }}>
            <PostDetails
                timelinePostModel={userPostTimelinePost}
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
                <UserPostBody
                    title={userPost.title ?? ''}
                    post={userPost.body ?? ''}
                    images={userPost.images ?? []}
                />
            </PostDetails>
        </View>
    );
};
