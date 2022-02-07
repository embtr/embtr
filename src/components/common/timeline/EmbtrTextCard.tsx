import * as React from 'react';
import { getAuth } from 'firebase/auth';
import { TextCard } from 'src/components/common/timeline/TextCard';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import ChallengeController, { ChallengeModel1, challengeWasAcceptedBy, challengeWasLikedBy } from 'src/controller/timeline/challenge/ChallengeController';

type commentsNavigationProp = StackNavigationProp<TimelineTabScreens, 'ChallengeComments'>;

interface Props {
    challengeModel: ChallengeModel1
}

export const EmbtrTextCard = ({ challengeModel }: Props) => {
    const [likes, setLikes] = React.useState(challengeModel.public.likes.length);
    const [comments, setComments] = React.useState(challengeModel.public.comments.length);
    const [participants, setParticipants] = React.useState(challengeModel.public.participants.length);

    const uid = getAuth().currentUser?.uid;
    const navigation = useNavigation<commentsNavigationProp>();
    const isLiked = challengeWasLikedBy(challengeModel, uid!);
    const isChallengeAccepted = challengeWasAcceptedBy(challengeModel, uid!);

    const onChallengeAccepted = () => {
        ChallengeController.addParticipant(challengeModel.id, uid!);
        setParticipants(participants + 1);
    };

    const onLike = () => {
        ChallengeController.likeChallenge(challengeModel.id, uid!);
        setLikes(likes + 1);
    }

    const onCommented = (text: string) => {
        navigation.navigate('ChallengeComments', { id: challengeModel?.id ? challengeModel.id : "" })
        //ChallengeController.addComment(challengeModel.id, uid!, text, () => { });
        //setComments(comments + 1);
    };

    return (
        <TextCard
            staticImage={require('assets/logo.png')}
            name={"embtr."}
            added={challengeModel.added}
            title={challengeModel.data.title}
            body={challengeModel.data.story}
            likes={likes}
            comments={comments}
            participants={participants}
            isLiked={isLiked}
            isAccepted={isChallengeAccepted}
            onAccepted={onChallengeAccepted}
            onLike={onLike}
            onCommented={onCommented}
        />
    )
}