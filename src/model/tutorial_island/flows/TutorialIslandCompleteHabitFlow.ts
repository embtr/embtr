import { PADDING_LARGE } from 'src/util/constants';
import {
    TooltipPosition,
    TutorialIslandFlow,
    TutorialIslandFlowKey,
    TutorialIslandOptionKey,
    TutorialIslandStepKey,
} from '../TutorialIslandModels';

export const TutorialIslandCompleteHabitFlow: TutorialIslandFlow = {
    key: TutorialIslandFlowKey.COMPLETE_HABIT,
    steps: [
        {
            key: TutorialIslandStepKey.COMPLETE_HABIT_FLOW__PRESS_TODAY_TAB,
            options: [
                {
                    key: TutorialIslandOptionKey.TAB__TODAY,
                    onPressReportable: true,
                    tooltip: {
                        text: 'Manage your daily habits in the Today Tab.',
                        position: TooltipPosition.TOP,
                        padding: PADDING_LARGE * 2.5,
                        alignment: 'center',
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.COMPLETE_HABIT_FLOW__SWIPE_COMPLETE,
            options: [
                {
                    key: TutorialIslandOptionKey.PLAN_DAY__PLANNED_TASK,
                    onPressReportable: false,
                    tooltip: {
                        text: 'Complete your habit by swiping right and letting it SNAP!',
                        position: TooltipPosition.TOP,
                        alignment: 'center',
                        padding: PADDING_LARGE,
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.COMPLETE_HABIT_FLOW__EXPLAIN_COMPLETE,
            options: [
                {
                    key: TutorialIslandOptionKey.GENERAL_NOTIFICATION,
                    onPressReportable: false,
                    tooltip: {
                        text: 'Your day is complete once all of your habits are finished. Let the confetti fly!',
                        position: TooltipPosition.CENTER,
                        alignment: 'center',
                        padding: PADDING_LARGE,
                        dismissableText: 'Sweet!',
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.COMPLETE_HABIT_FLOW__SWIPE_FAIL,
            options: [
                {
                    key: TutorialIslandOptionKey.PLAN_DAY__PLANNED_TASK,
                    onPressReportable: false,
                    tooltip: {
                        text: 'Life happens... Swipe left to reveal your "life happens" options and press Skip or Fail.',
                        position: TooltipPosition.TOP,
                        alignment: 'center',
                        padding: PADDING_LARGE,
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.COMPLETE_HABIT_FLOW__SWIPE_RESET,
            options: [
                {
                    key: TutorialIslandOptionKey.PLAN_DAY__PLANNED_TASK,
                    onPressReportable: false,
                    tooltip: {
                        text: 'Snap to the right again to reset your habit!',
                        position: TooltipPosition.BOTTOM,
                        alignment: 'center',
                        padding: PADDING_LARGE,
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.COMPLETE_HABIT_FLOW__PRESS_EDIT,
            options: [
                {
                    key: TutorialIslandOptionKey.PLAN_DAY__PLANNED_TASK,
                    onPressReportable: false,
                    tooltip: {
                        text: 'Tap on the habit to view advanced options!',
                        position: TooltipPosition.TOP,
                        alignment: 'center',
                        padding: PADDING_LARGE,
                    },
                },
            ],
        },
    ],
};
