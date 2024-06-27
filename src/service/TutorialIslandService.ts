import {
    TutorialIslandFlow,
    TutorialIslandFlowState,
    TutorialIslandOption,
    TutorialIslandState,
    TutorialIslandStep,
    TutorialIslandStepOption,
    flowToStepMap,
    stepToOptionMap,
} from 'src/model/TutorialIslandModels';

export class TutorialIslandService {
    public static flowContainsStep(flow: TutorialIslandFlow, step: TutorialIslandStep): boolean {
        return this.getStepsForFlow(flow).includes(step);
    }

    public static getStepOption(
        step: TutorialIslandStep,
        option: TutorialIslandOption
    ): TutorialIslandStepOption | undefined {
        return this.getOptionsForStep(step).find((stepOption) => stepOption.option === option);
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

    private static getOptionsForStep(step: TutorialIslandStep): TutorialIslandStepOption[] {
        return stepToOptionMap.get(step) || [];
    }
}
