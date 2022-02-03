import * as React from 'react';
import { getAuth } from 'firebase/auth';
import { TextCard } from 'src/components/common/timeline/TextCard';
import ExploreController, { ChallengeModel as ChallengeModel } from 'src/controller/explore/ExploreController';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ExploreTabScreens } from 'src/navigation/RootStackParamList';

type challengeCommentsNavigationProp = StackNavigationProp<ExploreTabScreens, 'ChallengeComments'>;

interface Props {
    challengeModel: ChallengeModel
}

export const EmbtrTextCard = ({ challengeModel }: Props) => {
    const [likes, setLikes] = React.useState(challengeModel.likes.length);
    const [participants, setParticipants] = React.useState(challengeModel.participants.length);

    const uid = getAuth().currentUser?.uid;

    const navigation = useNavigation<challengeCommentsNavigationProp>();


    const onChallengeAccepted = () => {
        ExploreController.acceptChallenge(challengeModel.id, uid!);
        setParticipants(participants + 1);
    };

    const onLike = () => {
        ExploreController.likeChallenge(challengeModel.id, uid!);
        setLikes(likes + 1);
    }

    const onCommented = (text: string) => {
        navigation.navigate('ChallengeComments', { id: challengeModel.id })
        //ExploreController.addComment(challengeModel.id, uid!, text);
        //setComments(comments + 1);
    };

    const isLiked = challengeModel.likes.includes(uid!);

    let isChallengeAccepted = false;
    challengeModel.participants.forEach(participant => {
        if (participant.uid === uid) {
            isChallengeAccepted = true;
            return;
        }
    });

    const comments = challengeModel.comments.length;

    return (
        <TextCard
            staticImage={require('assets/logo.png')}
            name={"embtr."}
            added={challengeModel.added}
            title={challengeModel.title}
            body={challengeModel.synopsis}
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