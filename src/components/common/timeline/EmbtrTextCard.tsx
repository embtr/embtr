import { getAuth } from 'firebase/auth';
import * as React from 'react';
import { TextCard } from 'src/components/common/timeline/TextCard';
import ExploreController, { ChallangeModel as ChallengeModel } from 'src/controller/explore/ExploreController';

interface Props {
    challengeModel: ChallengeModel
}

export const EmbtrTextCard = ({ challengeModel }: Props) => {
    const [likes, setLikes] = React.useState(challengeModel.likes.length);
    const [comments, setComments] = React.useState(challengeModel.comments.length);

    const uid = getAuth().currentUser?.uid;

    const onLike = () => {
        ExploreController.likeChallenge(challengeModel.id, uid!);
        setLikes(likes + 1);
    }

    const onCommented = (text: string) => {
        ExploreController.addComment(challengeModel.id,uid!, text);
        setComments(comments + 1);
    };

    const isLiked = challengeModel.likes.includes(uid!);

    return <TextCard
        staticImage={require('assets/logo.png')}
        name={"embtr."} title={challengeModel.title}
        body={challengeModel.synopsis}
        likes={likes}
        comments={comments}
        isLiked={isLiked} onLike={onLike}
        onCommented={onCommented}
        latestComment={challengeModel.comments.length > 0 ? challengeModel.comments[challengeModel.comments.length - 1] : undefined}
    />
}