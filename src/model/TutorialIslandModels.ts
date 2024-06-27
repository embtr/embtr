import { FlexAlignType } from 'react-native';

/*
 *  INTERFACES
 */
export interface TutorialIslandFlowState {
    flow: TutorialIslandFlow;
    steps: TutorialIslandStep[];
}

export interface TutorialIslandState {
    flowState: TutorialIslandFlowState;
    currentStep: TutorialIslandStep;
}

export interface TutorialIslandStepOption {
    option: TutorialIslandOption;
    tooltip?: TutorialIslandTooltipData;
}

export interface TutorialIslandTooltipData {
    text: string;
    position: FlexAlignType;
}

/*
 *  ENUMS
 */
export enum TutorialIslandFlow {
    INVALID = 'INVALID',
    CREATE_HABIT = 'CREATE_HABIT',
    COMPLETE_HABIT = 'COMPLETE_HABIT',
}

export enum TutorialIslandStep {
    INVALID = 'INVALID',
    PRESS_TIMELNE_TAB = 'PRESS_TIMELINE_TAB',
    PRESS_HABITS_TAB = 'PRESS_HABITS_TAB',
    PRESS_TODAY_TAB = 'PRESS_TODAY_TAB',
    PRESS_JOURNEY_TAB = 'PRESS_JOURNEY_TAB',
    PRESS_PROFILE_TAB = 'PRESS_PROFILE_TAB',
    SUPER_SECRET_STEP = 'SUPER_SECRET_STEP',
}

export enum TutorialIslandOption {
    INVALID = 'INVALID',
    TIMELINE_TAB = 'TIMELINE_TAB',
    HABITS_TAB = 'HABITS_TAB',
    TODAY_TAB = 'TODAY_TAB',
    JOURNEY_TAB = 'JOURNEY_TAB',
    PROFILE_TAB = 'PROFILE_TAB',
    SUPER_SECRET_OPTION = 'SUPER_SECRET_OPTION',
}

/*
 * FLOW MAPPINGS
 */
export const flowToStepMap: Map<TutorialIslandFlow, TutorialIslandStep[]> = new Map();
flowToStepMap.set(TutorialIslandFlow.INVALID, []);

flowToStepMap.set(TutorialIslandFlow.CREATE_HABIT, [
    TutorialIslandStep.PRESS_HABITS_TAB,
    TutorialIslandStep.PRESS_TODAY_TAB,
    TutorialIslandStep.PRESS_TIMELNE_TAB,
    TutorialIslandStep.PRESS_JOURNEY_TAB,
    TutorialIslandStep.PRESS_PROFILE_TAB,
]);

flowToStepMap.set(TutorialIslandFlow.COMPLETE_HABIT, [
    TutorialIslandStep.PRESS_PROFILE_TAB,
    TutorialIslandStep.PRESS_HABITS_TAB,
    TutorialIslandStep.SUPER_SECRET_STEP,
]);

/*
 * STEP MAPPINGS
 */
export const stepToOptionMap: Map<TutorialIslandStep, TutorialIslandStepOption[]> = new Map();
stepToOptionMap.set(TutorialIslandStep.INVALID, []);

stepToOptionMap.set(TutorialIslandStep.PRESS_TIMELNE_TAB, [
    {
        option: TutorialIslandOption.TIMELINE_TAB,
        tooltip: { text: 'This is the timeline tab', position: 'flex-start' },
    },
]);

stepToOptionMap.set(TutorialIslandStep.PRESS_HABITS_TAB, [
    {
        option: TutorialIslandOption.HABITS_TAB,
        tooltip: {
            text: 'Let\'s create your first habit! You create habits in the "My Habits" tab.',
            position: 'center',
        },
    },
]);

stepToOptionMap.set(TutorialIslandStep.PRESS_TODAY_TAB, [
    { option: TutorialIslandOption.TODAY_TAB },
]);

stepToOptionMap.set(TutorialIslandStep.PRESS_JOURNEY_TAB, [
    {
        option: TutorialIslandOption.JOURNEY_TAB,

        tooltip: {
            text: 'This is such an amazing tool tip. Enjoy the journey!',
            position: 'center',
        },
    },
]);

stepToOptionMap.set(TutorialIslandStep.PRESS_PROFILE_TAB, [
    {
        option: TutorialIslandOption.PROFILE_TAB,
        tooltip: {
            text: 'This is the profile tab. I have a very long instruction. I wish you all the best.',
            position: 'flex-end',
        },
    },
]);

stepToOptionMap.set(TutorialIslandStep.SUPER_SECRET_STEP, [
    {
        option: TutorialIslandOption.SUPER_SECRET_OPTION,
        tooltip: { text: 'This is the super secret step', position: 'flex-start' },
    },
]);

export const INVALID_FLOW_STATE: TutorialIslandFlowState = {
    flow: TutorialIslandFlow.INVALID,
    steps: [],
};

export const CREATE_HABIT_FLOW: TutorialIslandFlowState = {
    flow: TutorialIslandFlow.CREATE_HABIT,
    steps: [],
};

/*
 * DEFAULT STATE
 */
export const DEFAULT_TUTORIAL_ISLAND_STATE: TutorialIslandState = {
    flowState: INVALID_FLOW_STATE,
    currentStep: TutorialIslandStep.INVALID,
};
