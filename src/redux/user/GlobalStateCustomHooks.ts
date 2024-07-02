import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getTutorialIslandState, setTutorialIslandState } from './GlobalState';
import {
    TutorialIslandFlow,
    TutorialIslandFlowState,
    TutorialIslandOptionKey,
    TutorialIslandStepKey,
} from 'src/model/tutorial_island/TutorialIslandModels';
import { TutorialIslandService } from 'src/service/TutorialIslandService';
import { current } from '@reduxjs/toolkit';

export namespace GlobalStateCustomHooks {
    export const useTutorialIslandState = () => {
        const tutorialIslandState = useAppSelector(getTutorialIslandState);
        return tutorialIslandState;
    };

    export const useReportOptionPressed = () => {
        const tutorialIslandState = useAppSelector(getTutorialIslandState);
        const dispatch = useAppDispatch();

        return (optionKey: TutorialIslandOptionKey) => {
            const currentStep = TutorialIslandService.getStepFromFlow(
                tutorialIslandState.flow,
                tutorialIslandState.currentStepKey
            );

            console.log('currentStep', currentStep);

            if (!currentStep) {
                console.log('Invalid current step', tutorialIslandState.currentStepKey);
                return;
            }

            const stepContainsOption = TutorialIslandService.stepContainsOption(
                currentStep,
                optionKey
            );

            console.log('stepContainsOption', stepContainsOption);

            if (!stepContainsOption) {
                console.log('Invalid option', optionKey);
                return;
            }

            const currentStepIndex = tutorialIslandState.flow.steps.findIndex(
                (step) => step.key === tutorialIslandState.currentStepKey
            );

            console.log('currentStepIndex', currentStepIndex);

            if (currentStepIndex === tutorialIslandState.flow.steps.length - 1) {
                console.log('Last step reached');
                const currentOption = currentStep.options.find(
                    (option) => option.key === optionKey
                );

                console.log('currentOption', currentOption);

                if (currentOption?.nextFlowKey) {
                    const flow = TutorialIslandService.getFlowFromKey(currentOption.nextFlowKey);
                    console.log('flow', flow);
                    const nextFlowState: TutorialIslandFlowState = {
                        flow,
                        currentStepKey: flow.steps[0]?.key ?? TutorialIslandStepKey.INVALID,
                    };
                    console.log('nextFlowState', nextFlowState);

                    dispatch(setTutorialIslandState(nextFlowState));
                }

                return;
            }

            const nextStep = tutorialIslandState.flow.steps[currentStepIndex + 1].key;
            console.log('nextStep', nextStep);

            const nextFlowState: TutorialIslandFlowState = {
                flow: tutorialIslandState.flow,
                currentStepKey: nextStep,
            };

            console.log('nextFlowState', nextFlowState);

            dispatch(setTutorialIslandState(nextFlowState));
        };
    };

    export const useSetTutorialIslandState = () => {
        const dispatch = useAppDispatch();

        return (flow: TutorialIslandFlow) => {
            const state: TutorialIslandFlowState = {
                flow,
                currentStepKey: flow.steps[0]?.key ?? TutorialIslandStepKey.INVALID,
            };

            dispatch(setTutorialIslandState(state));
        };
    };
}
