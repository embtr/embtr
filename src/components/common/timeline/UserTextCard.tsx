import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextCard } from 'src/components/common/timeline/TextCard';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import StoryController, { StoryModel, storyWasLikedBy } from 'src/controller/timeline/story/StoryController';
import { getAuth } from 'firebase/auth';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'TimelineComments'>;

interface Props {
    userProfileModel: UserProfileModel,
    storyModel: StoryModel
}

export const UserTextCard = ({ userProfileModel, storyModel }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();

    const [likes, setLikes] = React.useState(storyModel.public.likes.length);

    const onLike = () => {
        StoryController.likeStory(storyModel.id!, getAuth().currentUser!.uid);
        setLikes(likes + 1);
    }

    const onCommented = () => {
        navigation.navigate('TimelineComments', { id: storyModel?.id ? storyModel.id : "" })
    };

    const isLiked = storyWasLikedBy(storyModel, getAuth().currentUser!.uid);

    return <TextCard
        userProfileModel={userProfileModel}
        added={storyModel.added}
        name={userProfileModel.name!}
        isLiked={isLiked}
        title={storyModel.data.title}
        body={storyModel.data.story}
        likes={likes}
        comments={storyModel.public.comments.length}
        onLike={onLike}
        onCommented={onCommented}
    />
}