import { UserPost } from 'resources/schema';
import { UserPostElement } from 'src/components/timeline/UserPostElement';
import { Pressable } from 'react-native';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import React, { useCallback } from 'react';
import { UserPostInteractableElementCustomHooks } from './interactable/UserPostInteractableElementCustomHooks';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
    userPost: UserPost;
}

export const UserPostTimelineElement = ({ userPost }: Props) => {
    const interactableData =
        UserPostInteractableElementCustomHooks.useUserPostInteractableElement(userPost);
    const navigation = useEmbtrNavigation();

    useFocusEffect(
        React.useCallback(() => {
            UserPostInteractableElementCustomHooks.removeUserPostInteractableEventListeners(
                userPost
            );
        }, [])
    );

    const navigateToPostDetails = () => {
        if (!userPost.id) {
            return;
        }

        setTimeout(() => {
            UserPostInteractableElementCustomHooks.createUserPostInteractableEventListeners(
                userPost,
                interactableData
            );
        }, 0);
        navigation.navigate(Routes.USER_POST_DETAILS, { id: userPost.id });
    };

    return (
        <Pressable onPress={navigateToPostDetails}>
            <UserPostElement userPost={userPost} interactableData={interactableData} />
        </Pressable>
    );
};
