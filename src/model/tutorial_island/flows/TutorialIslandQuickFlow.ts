import { PADDING_LARGE } from 'src/util/constants';
import {
    TooltipPosition,
    TutorialIslandFlow,
    TutorialIslandFlowKey,
    TutorialIslandOptionKey,
    TutorialIslandStepKey,
} from '../TutorialIslandModels';

export const TutorialIslandQuickFlow: TutorialIslandFlow = {
    key: TutorialIslandFlowKey.QUICK_CREATE_HABITS,
    steps: [
        {
            key: TutorialIslandStepKey.QUICK_CREATE_HABITS__CREATE_HABITS,
            options: [
                {
                    key: TutorialIslandOptionKey.QUICK_CREATE_HABITS__CREATE_HABITS,
                    onPressReportable: false,
                },
            ],
        },
        {
            key: TutorialIslandStepKey.QUICK_CREATE_HABITS__VIEW_MANAGE_HABITS,
            options: [
                {
                    key: TutorialIslandOptionKey.TAB__MY_HABITS_TAB,
                    onPressReportable: true,
                    tooltip: {
                        text: 'Create and manage your habits.',
                        page: '1/5',
                        position: TooltipPosition.TOP,
                        alignment: 'center',
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.QUICK_CREATE_HABITS__VIEW_UPDATE_HABITS,
            options: [
                {
                    key: TutorialIslandOptionKey.TAB__TODAY,
                    onPressReportable: true,
                    tooltip: {
                        text: 'View and complete your habits for today.',
                        page: '2/5',
                        position: TooltipPosition.TOP,
                        padding: PADDING_LARGE * 2,
                        alignment: 'center',
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.QUICK_CREATE_HABITS__SWIPE_COMPLETE,
            options: [
                {
                    key: TutorialIslandOptionKey.PLAN_DAY__PLANNED_TASK,
                    onPressReportable: false,
                    tooltip: {
                        text: 'Complete your habit by swiping right and letting it SNAP. Try it now!',
                        page: '3/5',
                        position: TooltipPosition.TOP,
                        alignment: 'center',
                        padding: PADDING_LARGE,
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.QUICK_CREATE_HABITS__SWIPE_SKIP,
            options: [
                {
                    key: TutorialIslandOptionKey.PLAN_DAY__PLANNED_TASK,
                    onPressReportable: false,
                    tooltip: {
                        text: 'You can skip or fail a habit by swipping left. Select one!',
                        page: '4/5',
                        position: TooltipPosition.BOTTOM,
                        alignment: 'center',
                        padding: PADDING_LARGE,
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.QUICK_CREATE_HABITS__SWIPE_RESET,
            options: [
                {
                    key: TutorialIslandOptionKey.PLAN_DAY__PLANNED_TASK,
                    onPressReportable: false,
                    tooltip: {
                        text: 'Reset your habit by swiping right and letting it SNAP. Try it now!',
                        page: '5/5',
                        position: TooltipPosition.TOP,
                        alignment: 'center',
                        padding: PADDING_LARGE,
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.QUICK_CREATE_HABITS__BID_GOODLUCK,
            options: [
                {
                    key: TutorialIslandOptionKey.GENERAL_NOTIFICATION,
                    onPressReportable: false,
                    tooltip: {
                        text: 'Your onboarding is complete! Explore the rest of the app on your own and enjoy your habit building experience!\n\nWelcome to Embtr 🎉',
                        position: TooltipPosition.CENTER,
                        alignment: 'center',
                        wide: true,
                        padding: PADDING_LARGE,
                        dismissableText: 'Sweet!',
                    },
                },
            ],
        },
        {
            key: TutorialIslandStepKey.COMPLETE,
            options: [],
        },
    ],
};
