import { UserPost } from 'resources/schema';
import { UserPostElement } from 'src/components/timeline/UserPostElement';
import { Pressable } from 'react-native';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import React from 'react';
import { UserPostInteractableElementCustomHooks } from './interactable/UserPostInteractableElementCustomHooks';

interface Props {
    userPost: UserPost;
}

export const UserPostTimelineElement = ({ userPost }: Props) => {
    const interactableData =
        UserPostInteractableElementCustomHooks.useUserPostInteractableElement(userPost);
    const navigation = useEmbtrNavigation();

    const navigateToPostDetails = () => {
        if (!userPost.id) {
            return;
        }

        UserPostInteractableElementCustomHooks.createUserPostInteractableEventListeners(
            userPost,
            interactableData
        );
        navigation.navigate(Routes.USER_POST_DETAILS, { id: userPost.id });
    };

    return (
        <Pressable onPress={navigateToPostDetails}>
            <UserPostElement userPost={userPost} interactableData={interactableData} />
        </Pressable>
    );
};
