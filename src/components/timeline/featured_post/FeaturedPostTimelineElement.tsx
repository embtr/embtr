import React from 'react';
import { Pressable } from 'react-native';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { FeaturedPost } from 'resources/schema';
import { FeaturedPostInteractableElementCustomHooks } from '../interactable/FeaturedPostInteractableElementCustomHooks';
import { FeaturedPostElement } from './FeaturedPostElement';
import { Routes } from 'src/navigation/RootStackParamList';
import { useFocusEffect } from '@react-navigation/native';

interface Props {
    featuredPost: FeaturedPost;
}

export const FeaturedPostTimelineElement = ({ featuredPost }: Props) => {
    const navigation = useEmbtrNavigation();

    useFocusEffect(
        React.useCallback(() => {
            FeaturedPostInteractableElementCustomHooks.removeFeaturedPostInteractableEventListeners(
                featuredPost
            );
        }, [])
    );

    const interactableData =
        FeaturedPostInteractableElementCustomHooks.useFeaturedPostInteractableElement(featuredPost);

    const navigateToPostDetails = () => {
        if (!featuredPost.id) {
            return;
        }

        setTimeout(() => {
            FeaturedPostInteractableElementCustomHooks.createFeaturedPostInteractableEventListeners(
                featuredPost,
                interactableData
            );
        }, 0);

        navigation.navigate(Routes.FEATURED_POST_DETAILS, { id: featuredPost.id });
    };

    return (
        <Pressable onPress={navigateToPostDetails}>
            <FeaturedPostElement featuredPost={featuredPost} interactableData={interactableData} />
        </Pressable>
    );
};
