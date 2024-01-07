import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import { PostDetails } from 'src/components/common/comments/PostDetails';
import StoryController, { StoryCustomHooks } from 'src/controller/timeline/story/StoryController';
import { Alert, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { StackNavigationProp } from '@react-navigation/stack';
import { Comment } from 'resources/schema';
import { useAppDispatch } from 'src/redux/Hooks';
import { addTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';
import { UserProfileModel } from 'src/model/OldModels';
import { Screen } from '../Screen';
import { PostUtility } from 'src/util/post/PostUtility';
import { TimelineController } from 'src/controller/timeline/TimelineController';

export const UserPostDetails = () => {
    const { colors } = useTheme();

    const route = useRoute<RouteProp<TimelineTabScreens, 'UserPostDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

    const dispatch = useAppDispatch();
    const userPost = StoryCustomHooks.useStory(route.params.id);

    if (!userPost.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const userPostTimelinePost = PostUtility.createUserPostTimelineModel(userPost.data);
    console.log(userPostTimelinePost.id, userPostTimelinePost.likes.length);
    const userIsPostOwner = userPost.data?.user?.uid === getAuth().currentUser?.uid;

    const submitComment = async (text: string, taggedUsers: UserProfileModel[]) => {
        if (!userPost.data?.id) {
            return;
        }

        await StoryController.addCommentViaApi(userPost.data.id, text);
        StoryController.invalidate(userPost.data.id);
    };

    const deleteComment = async (comment: Comment) => {
        if (!userPost.data?.id) {
            return;
        }

        await StoryController.deleteCommentViaApi(comment);
        dispatch(addTimelineCardRefreshRequest('POST_' + userPost.data.id));
        StoryController.invalidate(userPost.data.id);
    };

    const navigateToEdit = () => {
        if (!userPost.data?.id) {
            return;
        }

        if (!userIsPostOwner) {
            return;
        }

        navigation.navigate('EditUserPostDetails', { id: userPost.data.id });
    };

    const deletePost = () => {
        if (!userPost.data?.id) {
            return;
        }

        if (!userIsPostOwner) {
            return;
        }

        Alert.alert(
            'Delete Post',
            'Are you sure you want to delete this post? This cannot be undone.',
            [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                },
                {
                    text: 'I am sure. Delete it.',
                    onPress: async () => {
                        if (!userPost.data) {
                            return;
                        }

                        await StoryController.deleteViaApi(userPost.data);
                        navigation.navigate('Timeline');
                    },
                },
            ]
        );
    };

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: colors.background }}>
            <PostDetails
                timelinePostModel={userPostTimelinePost}
                submitComment={submitComment}
                deleteComment={deleteComment}
                onEdit={navigateToEdit}
                onDelete={deletePost}
            />
        </View>
    );
};
