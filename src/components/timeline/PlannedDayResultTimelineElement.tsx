import React from 'react';
import { Pressable } from 'react-native';
import { PlannedDayResult } from 'resources/schema';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { PlannedDayResultElement } from 'src/components/timeline/PlannedDayResultElement';
import { PlannedDayResultInteractableElementCustomHooks } from './interactable/PlannedDayResultInteractableElementCustomHooks';

interface Props {
    plannedDayResult: PlannedDayResult;
}

export const PlannedDayResultTimelineElement = ({ plannedDayResult }: Props) => {
    const interactableData =
        PlannedDayResultInteractableElementCustomHooks.usePlannedDayResultInteractableElement(
            plannedDayResult
        );

    const navigation = useEmbtrNavigation();

    const navigateToPlannedDayResultDetails = () => {
        if (!plannedDayResult.id) {
            return;
        }

        PlannedDayResultInteractableElementCustomHooks.createPlannedDayResultInteractableEventListeners(
            plannedDayResult,
            interactableData
        );
        navigation.navigate(Routes.DAILY_RESULT_DETAILS, { id: plannedDayResult.id });
    };

    return (
        <Pressable onPress={navigateToPlannedDayResultDetails}>
            <PlannedDayResultElement
                plannedDayResult={plannedDayResult}
                interactableData={interactableData}
            />
        </Pressable>
    );
};
