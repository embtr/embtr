import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextCard } from 'src/components/common/timeline/TextCard';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import StoryController, { StoryModel } from 'src/controller/story/StoryController';
import { getAuth } from 'firebase/auth';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    userProfileModel: UserProfileModel,
    storyModel: StoryModel
}

export const UserTextCard = ({ userProfileModel, storyModel }: Props) => {
    const navigation = useNavigation<userProfileScreenProp>();

    const toUserProfile = () => {
        navigation.navigate('UserProfile', { id: userProfileModel.uid! })
    };

    const onLike = () => {
        StoryController.likeStory(storyModel.id!, getAuth().currentUser!.uid);
        //setLikes(likes + 1);
    }

    const onCommented = (text: string) => {
        //navigation.navigate('ChallengeComments', { id: challengeModel.id })
        //ExploreController.addComment(challengeModel.id, uid!, text);
        //setComments(comments + 1);
    };

    return <TextCard
        httpImage={userProfileModel.photoUrl!}
        onTouchImage={toUserProfile}
        added={storyModel.added}
        name={userProfileModel.name!}
        isLiked={false} title={storyModel.data.title}
        body={storyModel.data.story}
        likes={storyModel.public.likes.length}
        comments={storyModel.public.comments.length}
        onLike={onLike}
        onCommented={onCommented}
    />
}