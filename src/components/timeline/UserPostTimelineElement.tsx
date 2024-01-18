import { UserPost } from 'resources/schema';
import { UserPostElement } from 'src/components/timeline/UserPostElement';
import { InteractableElementCustomHooks } from 'src/components/timeline/InteractableElementCustomHooks';
import { DeviceEventEmitter, Pressable } from 'react-native';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import React from 'react';

interface Props {
    userPost: UserPost;
}

export const UserPostTimelineElement = ({ userPost }: Props) => {
    const interactableData =
        InteractableElementCustomHooks.useUserPostInteractableElement(userPost);
    const navigation = useEmbtrNavigation();

    const navigateToPostDetails = () => {
        if (!userPost.id) {
            return;
        }

        DeviceEventEmitter.addListener(`onLike_${userPost.id}`, () => {
            interactableData.wasLiked();
        });

        DeviceEventEmitter.addListener(`onCommentAdded_${userPost.id}`, () => {
            interactableData.commentWasAdded();
        });

        DeviceEventEmitter.addListener(`onCommentDeleted_${userPost.id}`, () => {
            interactableData.commentWasDeleted();
        });

        navigation.navigate(Routes.USER_POST_DETAILS, { id: userPost.id });
    };

    return (
        <Pressable onPress={navigateToPostDetails}>
            <UserPostElement userPost={userPost} interactableData={interactableData} />
        </Pressable>
    );
};
