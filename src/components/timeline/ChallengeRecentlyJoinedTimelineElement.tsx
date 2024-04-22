import React from 'react';
import { Pressable } from 'react-native';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { ChallengeRecentlyJoined } from 'resources/types/dto/Challenge';
import { ChallengeSummaryInteractableElementCustomHooks } from './interactable/ChallengeSummaryInteractableElementCustomHooks';
import { ChallengeRecentlyJoinedElement } from './ChallengeRecentlyJoinedElement';

interface Props {
    challengeRecentlyJoined: ChallengeRecentlyJoined;
}

export const ChallengeRecentlyJoinedTimelineElement = ({ challengeRecentlyJoined }: Props) => {
    const navigation = useEmbtrNavigation();

    const interactableData =
        ChallengeSummaryInteractableElementCustomHooks.useInteractableElement(
            challengeRecentlyJoined
        );

    const navigateToChallengeDetails = () => {
        if (!challengeRecentlyJoined.id) {
            return;
        }

        ChallengeSummaryInteractableElementCustomHooks.createEventListeners(
            challengeRecentlyJoined,
            interactableData
        );
        navigation.navigate(Routes.CHALLENGE_DETAILS_VIEW, { id: challengeRecentlyJoined.id });
    };

    return (
        <Pressable onPress={navigateToChallengeDetails}>
            <ChallengeRecentlyJoinedElement
                challengeRecentlyJoined={challengeRecentlyJoined}
                interactableData={interactableData}
            />
        </Pressable>
    );
};
