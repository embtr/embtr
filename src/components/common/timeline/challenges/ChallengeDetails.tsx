import React from 'react';
import { Keyboard, View } from 'react-native';
import { Challenge, Comment } from 'resources/schema';
import { Routes } from 'src/navigation/RootStackParamList';
import { ChallengeCustomHooks } from 'src/controller/challenge/ChallengeController';
import { Screen } from '../../Screen';
import { ChallengeBody } from './ChallengeBody';
import { Banner } from '../../Banner';
import { HorizontalLine } from '../../HorizontalLine';
import PostDetailsActionBar from '../../comments/PostDetailsActionBar';
import ScrollableTextInputBox from '../../textbox/ScrollableTextInputBox';
import { CommentsScrollView } from '../../comments/CommentsScrollView';
import { ChallengeInteractableElementCustomHooks } from 'src/components/timeline/interactable/ChallengeInteractableElemnentCustomHooks';
import { useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { ChallengeDto } from 'resources/types/dto/Challenge';

export interface Props {
    challengeDto: ChallengeDto
}

const ChallengeDetailsImpl = ({ challengeDto }: Props) => {
    const challenge = challengeDto.challenge;

    React.useEffect(() => {
        return () => {
            ChallengeInteractableElementCustomHooks.removeChallengeInteractableEventListeners(challenge);
        };
    }, []);

    const interactableData =
        ChallengeInteractableElementCustomHooks.useChallengeInteractableElement(
            challenge
        );

    if (!challenge?.creator) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const submitComment = async (comment: string, taggedUsers: string[]) => {
        Keyboard.dismiss();

        if (!challenge.id) {
            return;
        }

        interactableData.onCommentAdded(comment);
    };

    const deleteComment = async (comment: Comment) => {
        interactableData.onCommentDeleted(comment);
    };

    return (
        <Screen>
            <ScrollableTextInputBox submitComment={submitComment}>
                <Banner name="Challenge Details" leftText="back" leftRoute="BACK" />
                <HorizontalLine />

                <View style={{ padding: 7.5 }}>
                    <ChallengeBody challenge={challenge} />
                </View>

                <PostDetailsActionBar
                    interactableData={interactableData}
                    isCurrentUser={false}
                />

                <HorizontalLine />

                <CommentsScrollView comments={interactableData.comments} onDeleteComment={deleteComment} />
            </ScrollableTextInputBox>
        </Screen>
    );
};

export const ChallengeDetails = () => {
    const route = useEmbtrRoute(Routes.CHALLENGE_DETAILS);
    const challengeDto = ChallengeCustomHooks.useChallenge(route.params.id);

    if (!challengeDto.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return <ChallengeDetailsImpl challengeDto={challengeDto.data} />;
}
