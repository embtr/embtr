import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { Routes, TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import StoryController, { StoryCustomHooks } from 'src/controller/timeline/story/StoryController';
import { Alert, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Comment } from 'resources/schema';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { UserProfileModel } from 'src/model/OldModels';
import { Screen } from '../Screen';
import { Banner } from 'src/components/common/Banner';
import {
    createEmbtrMenuOptions,
    EmbtrMenuOption,
} from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import ScrollableTextInputBox from 'src/components/common/textbox/ScrollableTextInputBox';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { CommentsScrollView } from 'src/components/common/comments/CommentsScrollView';
import * as React from 'react';
import { UserPostTimelineElement } from 'src/components/timeline/UserPostTimelineElement';

export const UserPostDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserPostDetails'>>();
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();
    const closeMenu = useAppSelector(getCloseMenu);

    const dispatch = useAppDispatch();
    const userPost = StoryCustomHooks.useStory(route.params.id);

    if (!userPost.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

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
        StoryController.invalidate(userPost.data.id);
    };

    const navigateToEdit = () => {
        if (!userPost.data?.id) {
            return;
        }

        if (!userIsPostOwner) {
            return;
        }

        navigation.navigate(Routes.EDIT_USER_POST_DETAILS, { id: userPost.data.id });
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
            ],
            { cancelable: true }
        );
    };

    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Edit',
            onPress: () => {
                navigateToEdit();
                closeMenu();
            },
        },
        {
            name: 'Delete',
            onPress: () => {
                deletePost();
                closeMenu();
            },
            destructive: true,
        },
    ];

    const comments = userPost.data?.comments ?? [];

    return (
        <Screen>
            {userIsPostOwner ? (
                <Banner
                    name={'Post Details'}
                    leftIcon={'arrow-back'}
                    leftRoute="BACK"
                    rightIcon={'ellipsis-horizontal'}
                    menuOptions={createEmbtrMenuOptions(menuItems)}
                />
            ) : (
                <Banner name={'Post Details'} leftIcon={'arrow-back'} leftRoute="BACK" />
            )}

            {userIsPostOwner && <EmbtrMenuCustom />}

            <ScrollableTextInputBox submitComment={submitComment}>
                <View style={{ paddingHorizontal: TIMELINE_CARD_PADDING }}>
                    <UserPostTimelineElement initialUserPost={userPost.data} />
                </View>

                <CommentsScrollView comments={comments} onDeleteComment={deleteComment} />
            </ScrollableTextInputBox>
        </Screen>
    );
};
