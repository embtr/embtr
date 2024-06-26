import {
    TutorialIslandFlow,
    TutorialIslandFlowState,
    TutorialIslandOption,
    TutorialIslandState,
    TutorialIslandStep,
    flowToStepMap,
    stepToOptionMap,
} from 'src/model/TutorialIslandModels';

export class TutorialIslandService {
    public static flowContainsStep(flow: TutorialIslandFlow, step: TutorialIslandStep): boolean {
        return this.getStepsForFlow(flow).includes(step);
    }

    public static stepContainsOption(
        step: TutorialIslandStep,
        option: TutorialIslandOption
    ): boolean {
        return this.getOptionsForStep(step).includes(option);
    }

    public static tutorialIsActive(state: TutorialIslandState) {
        return state.flowState?.flow !== TutorialIslandFlow.INVALID;
    }

    public static createState(flow: TutorialIslandFlow): TutorialIslandState {
        const flowState = this.createFlowState(flow);
        const firstStep = this.getStepsForFlow(flow)[0];

        const state: TutorialIslandState = {
            flowState: flowState,
            currentStep: firstStep,
        };

        return state;
    }

    private static createFlowState(flow: TutorialIslandFlow): TutorialIslandFlowState {
        const flowState: TutorialIslandFlowState = {
            flow: flow,
            steps: this.getStepsForFlow(flow),
        };

        return flowState;
    }

    private static getStepsForFlow(flow: TutorialIslandFlow): TutorialIslandStep[] {
        return flowToStepMap.get(flow) || [];
    }

    private static getOptionsForStep(step: TutorialIslandStep): TutorialIslandOption[] {
        return stepToOptionMap.get(step) || [];
    }
}
