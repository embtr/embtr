import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextCard } from 'src/components/common/timeline/TextCard';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import StoryController, { StoryModel, timelineEntryWasLikedBy } from 'src/controller/timeline/story/StoryController';
import { getAuth } from 'firebase/auth';
import { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';

type timelineCommentsScreenProp = StackNavigationProp<TimelineTabScreens, 'TimelineComments'>;

interface Props {
    userProfileModel: UserProfileModel,
    dailyResult: DailyResultModel
}

export const DailyResultCard = ({ userProfileModel, dailyResult }: Props) => {
    const navigation = useNavigation<timelineCommentsScreenProp>();

    const [likes, setLikes] = React.useState(dailyResult.public.likes.length);

    const onLike = () => {
        //StoryController.likeStory(dailyResult, getAuth().currentUser!.uid);
        setLikes(likes + 1);
    }

    const onCommented = () => {
        navigation.navigate('TimelineComments', { id: dailyResult?.id ? dailyResult.id : "" })
    };

    const isLiked = timelineEntryWasLikedBy(dailyResult, getAuth().currentUser!.uid);

    return <TextCard
        userProfileModel={userProfileModel}
        added={dailyResult.added}
        name={userProfileModel.name!}
        isLiked={isLiked}
        title={"Day Failed"}
        body={"I tried so hard"}
        likes={likes}
        comments={dailyResult.public.comments.length}
        onLike={onLike}
        onCommented={onCommented}
    />
}