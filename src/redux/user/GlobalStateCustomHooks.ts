import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getTutorialIslandState, setCurrentUser, setTutorialIslandState } from './GlobalState';
import {
    TutorialIslandFlow,
    TutorialIslandFlowState,
    TutorialIslandOptionKey,
    TutorialIslandStepKey,
} from 'src/model/tutorial_island/TutorialIslandModels';
import { TutorialIslandService } from 'src/service/TutorialIslandService';
import { UserPropertyController } from 'src/controller/user/UserPropertyController';
import { AppDispatch } from '../store';
import { Constants } from 'resources/types/constants/constants';

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

            if (!currentStep) {
                return;
            }

            const stepContainsOption = TutorialIslandService.stepContainsOption(
                currentStep,
                optionKey
            );

            if (!stepContainsOption) {
                return;
            }

            const currentStepIndex = tutorialIslandState.flow.steps.findIndex(
                (step) => step.key === tutorialIslandState.currentStepKey
            );

            if (currentStepIndex === tutorialIslandState.flow.steps.length - 1) {
                const currentOption = currentStep.options.find(
                    (option) => option.key === optionKey
                );

                if (currentOption?.nextFlowKey) {
                    const flow = TutorialIslandService.getFlowFromKey(currentOption.nextFlowKey);
                    const nextFlowState: TutorialIslandFlowState = {
                        flow,
                        currentStepKey: flow.steps[0]?.key ?? TutorialIslandStepKey.INVALID,
                    };

                    dispatch(setTutorialIslandState(nextFlowState));
                }

                return;
            }

            const nextStepKey = tutorialIslandState.flow.steps[currentStepIndex + 1].key;

            const nextFlowState: TutorialIslandFlowState = {
                flow: tutorialIslandState.flow,
                currentStepKey: nextStepKey,
            };

            if (nextStepKey === TutorialIslandStepKey.COMPLETE) {
                completeTutorialIsland(dispatch);
            }

            dispatch(setTutorialIslandState(nextFlowState));
        };
    };

    const completeTutorialIsland = async (dispatch: AppDispatch) => {
        const user = await UserPropertyController.setTutorialCompletionState(
            Constants.CompletionState.COMPLETE
        );
        dispatch(setCurrentUser(user));
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
