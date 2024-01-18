import React from 'react';
import { PlannedDayResult } from 'resources/schema';
import { InteractableElementCustomHooks } from 'src/components/timeline/InteractableElementCustomHooks';
import { PlannedDayResultElement } from 'src/components/timeline/PlannedDayResultElement';

interface Props {
    plannedDayResult: PlannedDayResult;
}

export const PlannedDayResultTimelineElement = ({ plannedDayResult }: Props) => {
    const interactableData =
        InteractableElementCustomHooks.usePlannedDayResultInteractableElement(plannedDayResult);

    return (
        <PlannedDayResultElement
            plannedDayResult={plannedDayResult}
            interactableData={interactableData}
        />
    );
};
