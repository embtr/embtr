import * as React from 'react';
import { CreateEditUserPostBase } from './CreateEditUserPostBase';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { UserPost } from 'resources/schema';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { EmptyScreen } from 'src/components/common/EmptyScreen';
import StoryController from 'src/controller/timeline/story/StoryController';
import { TimelineController } from 'src/controller/timeline/TimelineController';
import * as StoreReview from 'expo-store-review';

export const CreateUserPost = () => {
    const navigation = useEmbtrNavigation();

    const currentUserId = UserCustomHooks.useCurrentUserId();

    if (!currentUserId.data) {
        return <EmptyScreen />;
    }

    const userPost: UserPost = {
        userId: currentUserId.data,
    };

    const onSubmit = async (userPost: UserPost) => {
        await StoryController.createViaApi(userPost);

        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
            StoreReview.requestReview();
        }

        TimelineController.invalidateCache();
        navigation.goBack();
    };

    return <CreateEditUserPostBase userPost={userPost} onSubmit={onSubmit} />;
};
