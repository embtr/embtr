import React from 'react';
import { Animated, Easing, View } from 'react-native';
import { PlannedDay, PlannedTask } from 'resources/schema';
import { PADDING_LARGE } from 'src/util/constants';
import { PlanDayHeaderGuest } from 'src/components/plan/planning/PlanDayHeaderGuest';
import { TimeOfDayDivider } from 'src/components/plan/TimeOfDayDivider';
import { getCurrentUser, getFireConfetti } from 'src/redux/user/GlobalState';
import { useAppSelector } from 'src/redux/Hooks';
import { Constants } from 'resources/types/constants/constants';
import { PlanDayHeader } from '../plan/planning/PlanDayHeader';
import { TutorialIslandElement, TutorialIslandElementRef } from './TutorialIslandElement';
import { TutorialIslandPlannableTaskImproved } from './TutorialIslandPlannableTaskImproved';
import { GlobalStateCustomHooks } from 'src/redux/user/GlobalStateCustomHooks';
import {
    TutorialIslandOptionKey,
    TutorialIslandStepKey,
} from 'src/model/tutorial_island/TutorialIslandModels';

const isPlannedTask = (item: PlannedTask | TimeOfDayDivider): item is PlannedTask => {
    return 'completedQuantity' in item;
};

interface PlanningSections {
    allDay: Array<PlannedDay>;
    morning: Array<PlannedDay>;
    afternoon: Array<PlannedDay>;
    evening: Array<PlannedDay>;
    night: Array<PlannedDay>;
}

const defaultPlannedSections: PlanningSections = {
    allDay: [],
    morning: [],
    afternoon: [],
    evening: [],
    night: [],
};

const buildPlannedSections = (plannedTasks: PlannedTask[]): PlanningSections => {
    const allDay = plannedTasks.filter((task) => task.timeOfDay?.id === 5);
    const morning = plannedTasks.filter((task) => task.timeOfDay?.id === 1);
    const afternoon = plannedTasks.filter((task) => task.timeOfDay?.id === 2);
    const evening = plannedTasks.filter((task) => task.timeOfDay?.id === 3);
    const night = plannedTasks.filter((task) => task.timeOfDay?.id === 4);

    return { allDay, morning, afternoon, evening, night };
};

const buildElementList = (plannedSections: PlanningSections): Array<PlannedTask> => {
    const elements: Array<PlannedTask | TimeOfDayDivider> = [];

    if (plannedSections.allDay.length > 0) {
        elements.push({ id: 0, name: 'All Day' });
        elements.push(...plannedSections.allDay);
    }

    if (plannedSections.morning.length > 0) {
        elements.push({ id: 1, name: 'Morning' });
        elements.push(...plannedSections.morning);
    }

    if (plannedSections.afternoon.length > 0) {
        elements.push({ id: 2, name: 'Afternoon' });
        elements.push(...plannedSections.afternoon);
    }

    if (plannedSections.evening.length > 0) {
        elements.push({ id: 3, name: 'Evening' });
        elements.push(...plannedSections.evening);
    }

    if (plannedSections.night.length > 0) {
        elements.push({ id: 4, name: 'Night' });
        elements.push(...plannedSections.night);
    }

    return elements;
};

const getAllHabitsAreComplete = (plannedDay: PlannedDay): boolean => {
    const hasPlannedTasks = plannedDay.plannedTasks && plannedDay.plannedTasks.length > 0;

    const allHabitsAreComplete =
        hasPlannedTasks &&
        plannedDay.plannedTasks?.reduce(
            (acc, task) =>
                acc &&
                (task.status === Constants.CompletionState.FAILED ||
                    task.status === Constants.CompletionState.SKIPPED ||
                    (task.completedQuantity ?? 0) >= (task.quantity ?? 1)),
            true
        );

    return allHabitsAreComplete ?? false;
};

interface CompletionHistory {
    dayKey: string;
    completed: boolean;
}

interface Props {
    plannedDay: PlannedDay;
    dayKey: string;
    hideComplete?: boolean;
}

const runAnimation = (expand: boolean, viewHeight: Animated.Value, maxHeight: number) => {
    Animated.timing(viewHeight, {
        toValue: expand ? maxHeight : 0, // Set the desired height
        duration: 125, // Adjust the duration as needed
        easing: Easing.ease, // Adjust the easing function as needed
        useNativeDriver: false, // Make sure to set this to false for height animation
    }).start();
};

export const TutorialIslandPlanDay = ({ plannedDay, hideComplete, dayKey }: Props) => {
    const [elements, setElements] = React.useState<PlanningSections>(defaultPlannedSections);
    const [detailsViewHeight] = React.useState<Animated.Value>(new Animated.Value(60));

    const tutorialIslandState = GlobalStateCustomHooks.useTutorialIslandState();
    const currentUser = useAppSelector(getCurrentUser);
    const currentUserId = currentUser.id;
    const isCurrentUser = plannedDay.user?.id === currentUserId;

    const hasPlannedTasks = plannedDay.plannedTasks && plannedDay.plannedTasks.length > 0;
    const allHabitsAreComplete = getAllHabitsAreComplete(plannedDay);

    React.useEffect(() => {
        const expand = !hasPlannedTasks || allHabitsAreComplete;
        const expandHeight = !hasPlannedTasks ? 60 : 60 + PADDING_LARGE;
        runAnimation(expand ?? false, detailsViewHeight, expandHeight);
    }, [allHabitsAreComplete, hasPlannedTasks, dayKey]);

    React.useEffect(() => {
        const allPlannedTasks = hideComplete
            ? plannedDay.plannedTasks?.filter(
                (task) => (task.completedQuantity ?? 0) < (task.quantity ?? 1)
            )
            : plannedDay.plannedTasks;
        const allSections = buildPlannedSections(allPlannedTasks ?? []);

        const id = requestAnimationFrame(() => {
            setElements(allSections);
        });

        return () => {
            cancelAnimationFrame(id);
        };
    }, [plannedDay, hideComplete]);

    const header = isCurrentUser ? (
        <Animated.View
            style={{
                height: detailsViewHeight,
                overflow: 'hidden',
            }}
        >
            <PlanDayHeader
                plannedDay={plannedDay}
                hasPlannedTasks={hasPlannedTasks ?? false}
                allHabitsAreComplete={allHabitsAreComplete ?? false}
            />
        </Animated.View>
    ) : (
        <PlanDayHeaderGuest
            plannedDay={plannedDay}
            hasPlannedTasks={hasPlannedTasks ?? false}
            allHabitsAreComplete={allHabitsAreComplete ?? false}
            dayKey={dayKey}
        />
    );

    const ref = React.useRef<TutorialIslandElementRef>(null);

    const canSwipeLeft =
        tutorialIslandState.currentStepKey ===
        TutorialIslandStepKey.COMPLETE_HABIT_FLOW__SWIPE_COMPLETE ||
        tutorialIslandState.currentStepKey ===
        TutorialIslandStepKey.COMPLETE_HABIT_FLOW__SWIPE_RESET;
    const canSwipeRight =
        tutorialIslandState.currentStepKey ===
        TutorialIslandStepKey.COMPLETE_HABIT_FLOW__SWIPE_FAIL;
    const canPress =
        tutorialIslandState.currentStepKey ===
        TutorialIslandStepKey.COMPLETE_HABIT_FLOW__PRESS_EDIT;

    const renderItem = ({ item }: { item: PlannedTask | TimeOfDayDivider }) => {
        if (isPlannedTask(item)) {
            return (
                <View key={item.id} style={{ paddingBottom: PADDING_LARGE / 2 }}>
                    <TutorialIslandElement
                        ref={ref}
                        optionKey={TutorialIslandOptionKey.PLAN_DAY__PLANNED_TASK}
                    >
                        <TutorialIslandPlannableTaskImproved
                            canSwipeRight={canSwipeRight ?? false}
                            canSwipeLeft={canSwipeLeft ?? false}
                            canPress={canPress ?? false}
                            initialPlannedTask={item}
                            dayKey={dayKey}
                            currentUserId={currentUserId ?? 0}
                            onPress={() => {
                                ref.current?.reportOptionPressed();
                            }}
                            onComplete={() => {
                                ref.current?.reportOptionPressed();
                            }}
                            onReset={() => {
                                ref.current?.reportOptionPressed();
                            }}
                            onSkipFail={() => {
                                ref.current?.reportOptionPressed();
                            }}
                        />
                    </TutorialIslandElement>
                </View>
            );
        }

        return <TimeOfDayDivider timeOfDayDivider={item} />;
    };

    const data = buildElementList(elements);
    const jsxElements: JSX.Element[] = [];
    for (let i = 0; i < data.length; i++) {
        jsxElements.push(renderItem({ item: data[i] }));
    }

    return <View style={{ width: '100%' }}>{jsxElements}</View>;
};
