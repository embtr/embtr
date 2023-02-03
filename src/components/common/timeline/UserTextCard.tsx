import { TextCard } from 'src/components/common/timeline/TextCard';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import StoryController, { StoryModel } from 'src/controller/timeline/story/StoryController';
import { getAuth } from 'firebase/auth';
import React from 'react';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getCurrentTab, getTimelineCardRefreshRequests, removeTimelineCardRefreshRequest } from 'src/redux/user/GlobalState';
import { getNavigationHook } from 'src/util/navigation/NavigationHookProvider';

interface Props {
    userProfileModel: UserProfileModel;
    story: StoryModel;
}

export const UserTextCard = ({ userProfileModel, story }: Props) => {
    const currentTab = useAppSelector(getCurrentTab);
    const navigation = getNavigationHook(currentTab)();

    const [updatedStory, setUpdatedStory] = React.useState<StoryModel>();

    const storyToUse = updatedStory ? updatedStory : story;
    const timelineCardRefreshRequests: string[] = useAppSelector(getTimelineCardRefreshRequests);

    const dispatch = useAppDispatch();

    React.useEffect(() => {
        if (!story.id) {
            return;
        }

        if (timelineCardRefreshRequests.includes(story.id)) {
            StoryController.getStory(story.id, setUpdatedStory);

            //remove card from the refresh request list
            dispatch(removeTimelineCardRefreshRequest(story.id));
        }
    }, [timelineCardRefreshRequests]);

    const onLike = async () => {
        if (!story.id) {
            return;
        }

        await StoryController.likeStory(story, getAuth().currentUser!.uid);
        StoryController.getStory(story.id, setUpdatedStory);
    };

    const onCommented = () => {
        // @ts-ignore
        navigation.navigate('UserPostDetails', { id: story?.id ? story.id : '' });
    };

    return (
        <TextCard
            userProfileModel={userProfileModel}
            added={storyToUse.added}
            name={userProfileModel.name!}
            title={storyToUse.data.title}
            body={storyToUse.data.story}
            images={storyToUse.data.images ? storyToUse.data.images : []}
            likes={storyToUse.public.likes ? storyToUse.public.likes : []}
            comments={story.public.comments ? storyToUse.public.comments : []}
            onLike={onLike}
            onCommented={onCommented}
        />
    );
};
