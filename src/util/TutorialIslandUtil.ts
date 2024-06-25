import {
    TutorialIslandFlowOption,
    TutorialIslandState,
    TutorialIslandStep,
} from 'src/model/TutorialIslandModels';

export namespace TutorialIslandUtil {
    export const tutorialIsActive = (state: TutorialIslandState) => {
        return state.flow?.option !== TutorialIslandFlowOption.INVALID;
    };

    export const tutorialIsTargeted = (state: TutorialIslandState, step: TutorialIslandStep) => {
        return state.currentStep === step;
    };
}
