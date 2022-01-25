import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getAuth } from 'firebase/auth';
import { TextCard } from 'src/components/common/timeline/TextCard';
import ExploreController, { ChallangeModel as ChallengeModel } from 'src/controller/explore/ExploreController';
import { Comment } from 'src/controller/explore/ExploreController';

interface Props {
    challengeModel: ChallengeModel
}

export const EmbtrTextCard = ({ challengeModel }: Props) => {
    const [likes, setLikes] = React.useState(challengeModel.likes.length);
    const [comments, setComments] = React.useState(challengeModel.comments.length);
    const [participants, setParticipants] = React.useState(challengeModel.participants.length);
    const [latestComment, setLatestComment] = React.useState<Comment | undefined>(undefined);

    const uid = getAuth().currentUser?.uid;

    useFocusEffect(
        React.useCallback(() => {
            setLatestComment(challengeModel.comments.length > 0 ? challengeModel.comments[challengeModel.comments.length - 1] : undefined);
        }, [challengeModel.comments])
    );

    const onChallengeAccepted = () => {
        ExploreController.acceptChallenge(challengeModel.id, uid!);
        setParticipants(participants + 1);
    };

    const onLike = () => {
        ExploreController.likeChallenge(challengeModel.id, uid!);
        setLikes(likes + 1);
    }

    const onCommented = (text: string) => {
        let newComment: Comment = { uid: uid!, comment: text };
        setLatestComment(newComment);
        ExploreController.addComment(challengeModel.id, uid!, text);
        setComments(comments + 1);
    };

    const isLiked = challengeModel.likes.includes(uid!);

    let isChallengeAccepted = false;
    challengeModel.participants.forEach(participant => {
        if (participant.uid === uid) {
            isChallengeAccepted = true;
            return;
        }
    });
    

    return <TextCard
        staticImage={require('assets/logo.png')}
        name={"embtr."} title={challengeModel.title}
        body={challengeModel.synopsis}
        likes={likes}
        comments={comments}
        participants={participants}
        isLiked={isLiked}
        isAccepted={isChallengeAccepted}
        onAccepted={onChallengeAccepted}
        onLike={onLike}
        onCommented={onCommented}
        latestComment={latestComment}
    />
}