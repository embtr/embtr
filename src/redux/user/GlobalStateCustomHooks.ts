import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getTutorialIslandState, setTutorialIslandState } from './GlobalState';
import {
    TutorialIslandFlow,
    TutorialIslandOption,
    TutorialIslandState,
} from 'src/model/TutorialIslandModels';
import { TutorialIslandService } from 'src/service/TutorialIslandService';

export namespace GlobalStateCustomHooks {
    export const useTutorialIslandState = () => {
        const tutorialIslandState = useAppSelector(getTutorialIslandState);
        return tutorialIslandState;
    };

    export const useReportOptionPressed = () => {
        const tutorialIslandState = useAppSelector(getTutorialIslandState);
        const dispatch = useAppDispatch();

        return (option: TutorialIslandOption) => {
            const currentStepContainsOption = TutorialIslandService.stepContainsOption(
                tutorialIslandState.currentStep,
                option
            );

            if (currentStepContainsOption) {
                const currentStepIndex = tutorialIslandState.flowState.steps.indexOf(
                    tutorialIslandState.currentStep
                );

                console.log('Current step', tutorialIslandState.currentStep);
                const nextStep = tutorialIslandState.flowState.steps[currentStepIndex + 1];
                console.log('Next step', nextStep);
                dispatch(
                    setTutorialIslandState({
                        ...tutorialIslandState,
                        currentStep: nextStep,
                    })
                );
            }
        };
    };

    export const useSetTutorialIslandState = () => {
        const dispatch = useAppDispatch();

        return (flow: TutorialIslandFlow) => {
            const state: TutorialIslandState = TutorialIslandService.createState(flow);
            dispatch(setTutorialIslandState(state));
        };
    };
}
