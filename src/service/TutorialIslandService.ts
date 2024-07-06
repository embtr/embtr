import {
    TutorialIslandFlow,
    TutorialIslandFlowKey,
    TutorialIslandFlowState,
    TutorialIslandOptionKey,
    TutorialIslandStep,
    TutorialIslandStepKey,
} from 'src/model/tutorial_island/TutorialIslandModels';
import { TutorialIslandCompleteHabitFlow } from 'src/model/tutorial_island/flows/TutorialIslandCompleteHabitFlow';
import { TutorialIslandCreateHabitFlow } from 'src/model/tutorial_island/flows/TutorialIslandCreateHabitFlow';
import { TutorialIslandInvalidFlow } from 'src/model/tutorial_island/flows/TutorialIslandInvalidFlow';

//  «Tutorial island isn’t going to take that long» - TheIbraDev - 2024-07-04

export class TutorialIslandService {
    public static flowContainsStep(flow: TutorialIslandFlow, step: TutorialIslandStepKey): boolean {
        return flow.steps.some((flowStep) => flowStep.key === step);
    }

    public static stepContainsOption(
        step: TutorialIslandStep,
        option: TutorialIslandOptionKey
    ): boolean {
        return step.options.some((stepOption) => stepOption.key === option);
    }

    public static stepContainsAdvanceableOption(
        step: TutorialIslandStep,
        option: TutorialIslandOptionKey
    ): boolean {
        const currentOption = step.options.find((stepOption) => stepOption.key === option);
        return currentOption?.onPressReportable === true;
    }

    public static tutorialIsActive(state: TutorialIslandFlowState) {
        return state.flow.key !== TutorialIslandFlowKey.INVALID;
    }

    public static getFlowFromKey(flowKey: TutorialIslandFlowKey) {
        switch (flowKey) {
            case TutorialIslandFlowKey.CREATE_HABIT:
                return TutorialIslandCreateHabitFlow;
            case TutorialIslandFlowKey.COMPLETE_HABIT:
                return TutorialIslandCompleteHabitFlow;

            default:
                return TutorialIslandInvalidFlow;
        }
    }

    public static getStepFromFlow(flow: TutorialIslandFlow, stepKey: TutorialIslandStepKey) {
        console.log('getting steps for flow', flow);
        return flow.steps.find((step) => step.key === stepKey);
    }

    public static getOptionFromStep(step: TutorialIslandStep, optionKey: TutorialIslandOptionKey) {
        return step.options.find((option) => option.key === optionKey);
    }
}
