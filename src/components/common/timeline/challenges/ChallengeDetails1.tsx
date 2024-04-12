import React from 'react';
import { Keyboard, View } from 'react-native';
import { Comment } from 'resources/schema';
import { Routes } from 'src/navigation/RootStackParamList';
import { ChallengeCustomHooks } from 'src/controller/challenge/ChallengeController';
import { Screen } from '../../Screen';
import { Banner } from '../../Banner';
import ScrollableTextInputBox from '../../textbox/ScrollableTextInputBox';
import { CommentsScrollView } from '../../comments/CommentsScrollView';
import { useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { ChallengeDetailsInteractableElementCustomHooks } from 'src/components/timeline/interactable/ChallengeDetailsInteractableElementCustomHooks';
import { ChallengeDetails } from 'resources/types/dto/Challenge';
import { ChallengeDetailsBody } from './ChallengeDetailsBody';
import { PADDING_MEDIUM, PADDING_SMALL } from 'src/util/constants';

export interface Props {
    challengeDetails: ChallengeDetails;
}

const ChallengeDetailsImpl = ({ challengeDetails }: Props) => {
    React.useEffect(() => {
        return () => {
            ChallengeDetailsInteractableElementCustomHooks.removeEventListeners(challengeDetails);
        };
    }, []);

    const interactableData =
        ChallengeDetailsInteractableElementCustomHooks.useInteractableElement(challengeDetails);

    const submitComment = async (comment: string, taggedUsers: string[]) => {
        Keyboard.dismiss();

        if (!challengeDetails.id) {
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

                <View style={{ paddingHorizontal: PADDING_MEDIUM }}>
                    <ChallengeDetailsBody
                        challengeDetails={challengeDetails}
                        interactableData={interactableData}
                    />
                </View>

                <CommentsScrollView
                    comments={interactableData.comments}
                    onDeleteComment={deleteComment}
                />
            </ScrollableTextInputBox>
        </Screen>
    );
};

export const ChallengeDetails1 = () => {
    const route = useEmbtrRoute(Routes.CHALLENGE_DETAILS);
    const challengeDetails = ChallengeCustomHooks.useChallengeDetails(route.params.id);

    if (!challengeDetails.data) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    return <ChallengeDetailsImpl challengeDetails={challengeDetails.data} />;
};
