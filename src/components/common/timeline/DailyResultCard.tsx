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
    story: StoryModel
}

export const UserTextCard = ({ userProfileModel, story }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();

    const [likes, setLikes] = React.useState(story.public.likes.length);

    const onLike = () => {
        StoryController.likeStory(story, getAuth().currentUser!.uid);
        setLikes(likes + 1);
    }

    const onCommented = () => {
        navigation.navigate('TimelineComments', { id: story?.id ? story.id : "" })
    };

    const isLiked = storyWasLikedBy(story, getAuth().currentUser!.uid);

    return <TextCard
        userProfileModel={userProfileModel}
        added={story.added}
        name={userProfileModel.name!}
        isLiked={isLiked}
        title={story.data.title}
        body={story.data.story}
        likes={likes}
        comments={story.public.comments.length}
        onLike={onLike}
        onCommented={onCommented}
    />
}