import React from 'react';
import { TextCard } from 'src/components/common/timeline/TextCard';
import StoryController, { StoryModel } from 'src/controller/timeline/story/StoryController';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import {
    getCurrentTab,
    getTimelineCardRefreshRequests,
    removeTimelineCardRefreshRequest,
} from 'src/redux/user/GlobalState';
import { getNavigationHook } from 'src/util/navigation/NavigationHookProvider';
import { UserPost } from 'resources/schema';

interface Props {
    oldModel: StoryModel;
}

export const UserTextCard = React.memo(({ oldModel }: Props) => {
    const currentTab = useAppSelector(getCurrentTab);
    const navigation = getNavigationHook(currentTab)();

    const [updatedStory, setUpdatedStory] = React.useState<UserPost>(oldModel.data.userPost);
    const timelineCardRefreshRequests: string[] = useAppSelector(getTimelineCardRefreshRequests);
    const dispatch = useAppDispatch();

    const fetch = async () => {
        if (!updatedStory.id) {
            return;
        }

        const refreshed = await StoryController.getViaApi(updatedStory.id);
        if (!refreshed) {
            return;
        }

        setUpdatedStory(refreshed);
        return refreshed;
    };

    React.useEffect(() => {
        if (!updatedStory.id) {
            return;
        }

        const key = 'POST_' + updatedStory.id;

        if (timelineCardRefreshRequests.includes(key)) {
            fetch();
            //remove card from the refresh request list
            dispatch(removeTimelineCardRefreshRequest(key));
        }
    }, [timelineCardRefreshRequests]);

    const onLike = async () => {
        if (!updatedStory.id) {
            return;
        }

        await StoryController.addLikeViaApi(updatedStory.id);
        fetch();
    };

    const onCommented = () => {
        if (!updatedStory.id) {
            return;
        }

        // @ts-ignore
        navigation.navigate('UserPostDetails', { id: updatedStory.id });
    };

    return (
        <TextCard
            user={updatedStory.user ?? { displayName: 'some random user' }}
            added={updatedStory.createdAt ?? new Date()}
            name={updatedStory.user?.displayName ?? 'some random user'}
            title={updatedStory.title ?? 'some title'}
            body={updatedStory.body ?? 'some body'}
            likes={updatedStory.likes ?? []}
            comments={updatedStory.comments ?? []}
            images={updatedStory.images ?? []}
            onLike={onLike}
            onCommented={onCommented}
        />
    );
});
