import { PADDING_LARGE } from 'src/util/constants';
import {
    TooltipPosition,
    TutorialIslandFlow,
    TutorialIslandFlowKey,
    TutorialIslandOptionKey,
    TutorialIslandStepKey,
} from '../TutorialIslandModels';

export const TutorialIslandCreateHabitFlow: TutorialIslandFlow = {
    key: TutorialIslandFlowKey.CREATE_HABIT,
    steps: [
        {
            key: TutorialIslandStepKey.CREATE_HABIT_FLOW__PRESS_HABITS_TAB,
            options: [
                {
                    key: TutorialIslandOptionKey.TAB__MY_HABITS_TAB,
                    onPressReportable: true,
                    tooltip: {
                        text: 'Create and manage your habits.',
                        position: TooltipPosition.TOP,
                        alignment: 'center',
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.CREATE_HABIT_FLOW__PRESS_ADD_NEW_HABIT_BUTTON,
            options: [
                {
                    key: TutorialIslandOptionKey.MY_HABITS__ADD_NEW_HABIT_BUTTON,
                    onPressReportable: true,
                    tooltip: {
                        text: 'Create a new habit!',
                        position: TooltipPosition.TOP,
                        alignment: 'center',
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.CREATE_HABIT_FLOW__EXPLAIN_SET_CORE_INFO,
            options: [
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__CHANGE_TITLE,
                    onPressReportable: false,
                },
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__CHANGE_NOTES,
                    onPressReportable: false,
                    tooltip: {
                        text: "Fill out your habit's title and notes!",
                        position: TooltipPosition.BOTTOM,
                        alignment: 'center',
                        dismissableText: 'Got it!',
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.CREATE_HABIT_FLOW__EXPLAIN_SET_OPTIONAL_INFO,
            options: [
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__DAYS_OF_THE_WEEK_TOGGLE,
                    onPressReportable: false,
                    tooltip: {
                        text: 'Fine tune your habit with these options.',
                        position: TooltipPosition.TOP,
                        alignment: 'center',
                        dismissableText: 'Got it!',
                    },
                },
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__SPECIFIC_TIME_OF_DAY_TOGGLE,
                    onPressReportable: false,
                },
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__DETAILS_TOGGLE,
                    onPressReportable: false,
                },
            ],
        },
        {
            key: TutorialIslandStepKey.CREATE_HABIT_FLOW__EXPLAIN_CREATE,
            options: [
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__CHANGE_TITLE,
                    onPressReportable: false,
                },
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__CHANGE_NOTES,
                    onPressReportable: false,
                },
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__CREATE_BUTTON,
                    onPressReportable: false,
                    blocked: true,
                    tooltip: {
                        text: 'When you are finished, create the habit!',
                        position: TooltipPosition.TOP,
                        alignment: 'center',
                        dismissableText: "Let's Go!",
                        padding: PADDING_LARGE,
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.CREATE_HABIT_FLOW__ACTION_CREATE,
            options: [
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__CHANGE_TITLE,
                    onPressReportable: false,
                },
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__CHANGE_NOTES,
                    onPressReportable: false,
                },
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__CREATE_BUTTON,
                    onPressReportable: false,
                },
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__DAYS_OF_THE_WEEK_TOGGLE,
                    onPressReportable: false,
                },
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__SPECIFIC_TIME_OF_DAY_TOGGLE,
                    onPressReportable: false,
                },
                {
                    key: TutorialIslandOptionKey.CREATE_EDIT_HABIT__DETAILS_TOGGLE,
                    onPressReportable: false,
                },
            ],
        },
        {
            key: TutorialIslandStepKey.CREATE_HABIT_FLOW__EXPLAIN_HABIT_CREATED,
            options: [
                {
                    key: TutorialIslandOptionKey.MY_HABITS__HABITS_LIST,
                    onPressReportable: false,
                    tooltip: {
                        text: 'Behold, your first habit! Amazing work!',
                        position: TooltipPosition.BOTTOM,
                        alignment: 'center',
                        dismissableText: 'Woo Hoo!',
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.CREATE_HABIT_FLOW__CHANGE_FLOW_TO_COMPLETE_HABIT,
            options: [
                {
                    key: TutorialIslandOptionKey.GENERAL_NOTIFICATION,
                    onPressReportable: false,
                    nextFlowKey: TutorialIslandFlowKey.COMPLETE_HABIT,
                    tooltip: {
                        text: "Now that you have created your first habit, let's interact with it!",
                        position: TooltipPosition.CENTER,
                        alignment: 'center',
                        dismissableText: "Let's Go!",
                    },
                },
            ],
        },
    ],
};
