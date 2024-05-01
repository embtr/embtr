import * as React from 'react';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { CreateEditUserPostBase } from './CreateEditUserPostBase';
import { useEmbtrNavigation, useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserPost } from 'resources/schema';
import { EmptyScreen } from 'src/components/common/EmptyScreen';
import { Routes } from 'src/navigation/RootStackParamList';
import StoryController, { StoryCustomHooks } from 'src/controller/timeline/story/StoryController';
import { TimelineController } from 'src/controller/timeline/TimelineController';

export const EditUserPost = () => {
    const colors = useTheme().colors;
    const navigation = useEmbtrNavigation();
    const route = useEmbtrRoute(Routes.EDIT_USER_POST);

    const userPost = StoryCustomHooks.useStory(route.params.id);

    if (!userPost.data) {
        return <EmptyScreen />;
    }

    const onSubmit = async (userPost: UserPost) => {
        await StoryController.updateViaApi(userPost);
        StoryController.invalidate(userPost.id ?? 0);
        TimelineController.invalidateCache();
        navigation.goBack();
    };

    return <CreateEditUserPostBase userPost={userPost.data} onSubmit={onSubmit} />;
};
