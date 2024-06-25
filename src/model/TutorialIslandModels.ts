export enum TutorialIslandFlowOption {
    INVALID = 'INVALID',
    CREATE_HABIT = 'CREATE_HABIT',
    COMPLETE_HABIT = 'COMPLETE_HABIT',
}

export enum TutorialIslandStep {
    INVALID = 'INVALID',
    NAVIGATE_TO_TIMELINE = 'NAVIGATE_TO_TIMELINE',
    NAVIGATE_TO_HABITS = 'NAVIGATE_TO_HABITS',
    NAVIGATE_TO_TODAY = 'NAVIGATE_TO_TODAY',
    NAVIGATE_TO_HABIT_JOURNEY = 'NAVIGATE_TO_HABIT_JOURNEY',
    NAVIGATE_TO_CURRENT_USER = 'NAVIGATE_TO_CURRENT_USER',

    PRESS_ADD_NEW_HABIT = 'PRESS_ADD_NEW_HABIT',
    PRESS_HABIT_JOURNEY_CHALLENGES = 'PRESS_HABIT_JOURNEY_CHALLENGES',
}

export interface TutorialIslandFlow {
    option: TutorialIslandFlowOption;
    steps: TutorialIslandStep[];
}

export interface TutorialIslandState {
    flow: TutorialIslandFlow;
    currentStep: TutorialIslandStep;
}

/*
 * FLOWS
 */

export const INVALID_FLOW: TutorialIslandFlow = {
    option: TutorialIslandFlowOption.INVALID,
    steps: [],
};

export const CREATE_HABIT_FLOW: TutorialIslandFlow = {
    option: TutorialIslandFlowOption.CREATE_HABIT,
    steps: [TutorialIslandStep.NAVIGATE_TO_HABITS, TutorialIslandStep.PRESS_ADD_NEW_HABIT],
};

export const DEFAULT_TUTORIAL_ISLAND_STATE: TutorialIslandState = {
    flow: INVALID_FLOW,
    currentStep: TutorialIslandStep.INVALID,
};

const getTutorialIslandFlow = (flowOption: TutorialIslandFlowOption): TutorialIslandFlow => {
    switch (flowOption) {
        case TutorialIslandFlowOption.CREATE_HABIT:
            return CREATE_HABIT_FLOW;
        default:
            return INVALID_FLOW;
    }
};

export const createTutorialIslandState = (flowOption: TutorialIslandFlowOption) => {
    const flow = getTutorialIslandFlow(flowOption);

    return {
        flow: flow,
        currentStep: flow.steps[0],
    };
};
