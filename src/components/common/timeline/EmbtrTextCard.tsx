import * as React from 'react';
import { TextCard } from 'src/components/common/timeline/TextCard';
import ExploreController, { ChallangeModel as ChallengeModel } from 'src/controller/explore/ExploreController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    challengeModel: ChallengeModel,
    userProfileModel: UserProfileModel
}

export const EmbtrTextCard = ({ challengeModel, userProfileModel }: Props) => {
    const [likes, setLikes] = React.useState(challengeModel.likes.length);
    const [comments, setComments] = React.useState(challengeModel.comments.length);

    const onLike = () => {
        ExploreController.likeChallenge(challengeModel.id, userProfileModel.uid!);
        setLikes(likes + 1);
    }

    const onCommented = (text: string) => {
        ExploreController.addComment(challengeModel.id, userProfileModel.uid!, text);
        setComments(comments + 1);
    };

    const isLiked = challengeModel.likes.includes(userProfileModel.uid!);

    return <TextCard
        staticImage={require('assets/logo.png')}
        name={"embtr."} title={challengeModel.title}
        body={challengeModel.synopsis}
        likes={likes}
        comments={comments}
        isLiked={isLiked} onLike={onLike}
        onCommented={onCommented}
    />
}