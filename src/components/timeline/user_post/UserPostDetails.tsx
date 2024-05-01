import { RouteProp, useRoute } from '@react-navigation/native';
import { Routes, TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { getAuth } from 'firebase/auth';
import StoryController, { StoryCustomHooks } from 'src/controller/timeline/story/StoryController';
import { Alert, View } from 'react-native';
import { UserPost } from 'resources/schema';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import { Banner } from 'src/components/common/Banner';
import {
    createEmbtrMenuOptions,
    EmbtrMenuOption,
} from 'src/components/common/menu/EmbtrMenuOption';
import { EmbtrMenuCustom } from 'src/components/common/menu/EmbtrMenuCustom';
import ScrollableTextInputBox from 'src/components/common/textbox/ScrollableTextInputBox';
import { PADDING_LARGE } from 'src/util/constants';
import * as React from 'react';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { CommentsScrollView } from 'src/components/common/comments/CommentsScrollView';
import { UserPostInteractableElementCustomHooks } from 'src/components/timeline/interactable/UserPostInteractableElementCustomHooks';
import { Screen } from 'src/components/common/Screen';
import { UserPostElement } from '../user_post/UserPostElement';
import { TimelineController } from 'src/controller/timeline/TimelineController';

const UserPostDetailsPlaceholder = () => {
    return (
        <Screen>
            <Banner name={'Post Details'} leftIcon={'arrow-back'} leftRoute="BACK" />
        </Screen>
    );
};

interface ImplementationProps {
    userPost: UserPost;
}

const UserPostDetailsImplementation = ({ userPost }: ImplementationProps) => {
    const navigation = useEmbtrNavigation();
    const closeMenu = useAppSelector(getCloseMenu);
    const interactableData =
        UserPostInteractableElementCustomHooks.useUserPostInteractableElement(userPost);

    const userIsPostOwner = userPost.user?.uid === getAuth().currentUser?.uid;

    const navigateToEdit = () => {
        if (!userPost.id) {
            return;
        }

        if (!userIsPostOwner) {
            return;
        }

        navigation.navigate(Routes.EDIT_USER_POST, { id: userPost.id });
    };

    const deletePost = () => {
        if (!userPost.id) {
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
                    onPress: () => { },
                    style: 'cancel',
                },
                {
                    text: 'I am sure. Delete it.',
                    onPress: async () => {
                        await StoryController.deleteViaApi(userPost);
                        TimelineController.invalidateCache();
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

            <ScrollableTextInputBox submitComment={interactableData.onCommentAdded}>
                <View style={{ paddingHorizontal: PADDING_LARGE }}>
                    <UserPostElement userPost={userPost} interactableData={interactableData} />
                </View>

                <CommentsScrollView
                    comments={interactableData.comments}
                    onDeleteComment={interactableData.onCommentDeleted}
                />
            </ScrollableTextInputBox>
        </Screen>
    );
};

export const UserPostDetails = () => {
    const route = useRoute<RouteProp<TimelineTabScreens, 'UserPostDetails'>>();
    const userPost = StoryCustomHooks.useStory(route.params.id);

    if (!userPost.data) {
        return <UserPostDetailsPlaceholder />;
    }

    return <UserPostDetailsImplementation userPost={userPost.data} />;
};
