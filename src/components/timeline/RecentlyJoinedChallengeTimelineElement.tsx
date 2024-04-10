import React from 'react';
import { Pressable } from 'react-native';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { RecentlyJoinedChallenge } from 'resources/types/dto/RecentlyJoinedChallenge';
import { ChallengeInteractableElementCustomHooks } from './interactable/ChallengeInteractableElemnentCustomHooks';
import { RecentlyJoinedChallengeElement } from './RecentlyJoinedChallengeElement';

interface Props {
    recentlyJoinedChallenge: RecentlyJoinedChallenge
}

export const RecentlyJoinedChallengeTimelineElement = ({ recentlyJoinedChallenge }: Props) => {
    const navigation = useEmbtrNavigation();

    const interactableData =
        ChallengeInteractableElementCustomHooks.useChallengeInteractableElement(
            recentlyJoinedChallenge.challenge.challenge
        );

    const navigateToChallengeDetails = () => {
        if (!recentlyJoinedChallenge.challenge.challenge.id) {
            return;
        }

        ChallengeInteractableElementCustomHooks.createChallengeInteractableEventListeners(
            recentlyJoinedChallenge.challenge.challenge,
            interactableData
        );
        navigation.navigate(Routes.CHALLENGE_DETAILS, { id: recentlyJoinedChallenge.challenge.challenge.id });
    };

    return (
        <Pressable onPress={navigateToChallengeDetails}>
            <RecentlyJoinedChallengeElement
                recentlyJoinedChallenge={recentlyJoinedChallenge}
                interactableData={interactableData}
            />
        </Pressable>
    );
};
