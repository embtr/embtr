import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getTutorialIslandState, setTutorialIslandState } from './GlobalState';
import {
    TutorialIslandFlowOption,
    TutorialIslandStep,
    createTutorialIslandState,
} from 'src/model/TutorialIslandModels';

export namespace GlobalStateCustomHooks {
    export const useTutorialIslandState = () => {
        const tutorialIslandState = useAppSelector(getTutorialIslandState);
        return tutorialIslandState;
    };

    export const useReportStepPressed = () => {
        const tutorialIslandState = useAppSelector(getTutorialIslandState);
        const dispatch = useAppDispatch();

        return (step: TutorialIslandStep) => {
            if (tutorialIslandState.currentStep === step) {
                console.log('step pressed');
                const currentStepIndex = tutorialIslandState.flow.steps.indexOf(step);
                const nextStep = tutorialIslandState.flow.steps[currentStepIndex + 1];
                dispatch(
                    setTutorialIslandState({
                        ...tutorialIslandState,
                        currentStep: nextStep,
                    })
                );
            }
        };
    };

    //todo fix naming
    export const useSetTutorialIslandState = () => {
        const dispatch = useAppDispatch();

        return (flowOption: TutorialIslandFlowOption) => {
            const state = createTutorialIslandState(flowOption);
            dispatch(setTutorialIslandState(state));
        };
    };
}
