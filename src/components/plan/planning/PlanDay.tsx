import React from 'react';
import { Animated, Easing, View } from 'react-native';
import { MemoizedPlannableTaskImproved } from '../PlannableTaskImproved';
import { PlannedDay, PlannedTask } from 'resources/schema';
//import { FlashList } from '@shopify/flash-list';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { FlatList } from 'react-native-gesture-handler';
import { PlanningService } from 'src/util/planning/PlanningService';
import { PlanDayHeader } from './PlanDayHeader';

export const keyExtractor = (plannedTask: PlannedTask) => {
    const key = PlanningService.getPlannedHabitUniqueKey(plannedTask);
    return key;
};

interface Props {
    plannedDay: PlannedDay;
    dayKey: string;
    hideComplete?: boolean;
}

const runAnimation = (expand: boolean, viewHeight: Animated.Value, maxHeight: number) => {
    console.log('running animation', maxHeight);
    Animated.timing(viewHeight, {
        toValue: expand ? maxHeight : 0, // Set the desired height
        duration: 125, // Adjust the duration as needed
        easing: Easing.ease, // Adjust the easing function as needed
        useNativeDriver: false, // Make sure to set this to false for height animation
    }).start();
};

export const PlanDay = ({ plannedDay, hideComplete, dayKey }: Props) => {
    const [elements, setElements] = React.useState<Array<PlannedTask>>([]);
    const [detailsViewHeight] = React.useState<Animated.Value>(new Animated.Value(60));

    const hasPlannedTasks = plannedDay.plannedTasks && plannedDay.plannedTasks.length > 0;
    const allHabitsAreComplete =
        hasPlannedTasks &&
        plannedDay.plannedTasks?.reduce(
            (acc, task) => acc && (task.completedQuantity ?? 0) >= (task.quantity ?? 1),
            true
        );

    React.useEffect(() => {
        const expand = !hasPlannedTasks || allHabitsAreComplete;
        const expandHeight = !hasPlannedTasks ? 60 : 60 + TIMELINE_CARD_PADDING;

        runAnimation(expand ?? false, detailsViewHeight, expandHeight);
    }, [allHabitsAreComplete, hasPlannedTasks]);

    React.useEffect(() => {
        if (!plannedDay.plannedTasks || plannedDay.plannedTasks.length === 0) {
            setElements([]);
            return;
        }

        if (plannedDay.plannedTasks.length < 7) {
            if (hideComplete) {
                setElements(
                    plannedDay.plannedTasks.filter(
                        (task) => (task.completedQuantity ?? 0) < (task.quantity ?? 1)
                    )
                );
            } else {
                setElements(plannedDay.plannedTasks);
            }

            return;
        }

        hideComplete
            ? plannedDay.plannedTasks
                  .slice(0, 7)
                  .filter((task) => (task.completedQuantity ?? 0) < (task.quantity ?? 1))
            : plannedDay.plannedTasks.slice(0, 7);

        const id = requestAnimationFrame(() => {
            if (plannedDay.plannedTasks) {
                setElements(
                    hideComplete
                        ? plannedDay.plannedTasks.filter(
                              (task) => (task.completedQuantity ?? 0) < (task.quantity ?? 1)
                          )
                        : plannedDay.plannedTasks
                );
            }
        });

        return () => {
            cancelAnimationFrame(id);
        };
    }, [plannedDay, hideComplete]);

    const renderItem = ({ item }: { item: PlannedTask }) => (
        <View style={{ paddingBottom: TIMELINE_CARD_PADDING / 2 }}>
            <MemoizedPlannableTaskImproved initialPlannedTask={item} dayKey={dayKey} />
        </View>
    );

    return (
        <View style={{ width: '100%' }}>
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
                    dayKey={dayKey}
                    hideComplete={hideComplete}
                />
            </Animated.View>

            <FlatList
                scrollEnabled={false}
                //estimatedFirstItemOffset={0}
                //estimatedItemSize={61}
                data={elements}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                removeClippedSubviews={true}
            />
        </View>
    );
};
