import React from 'react';
import { Dimensions, View } from 'react-native';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { MemoizedPlannableTaskImproved } from '../PlannableTaskImproved';
import { PlannedTask } from 'resources/schema';
import { FlashList } from '@shopify/flash-list';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';

export const keyExtractor = (plannedTask: PlannedTask) => {
    const key =
        'plannedDay' +
        plannedTask.plannedDayId +
        '_plannedTask' +
        plannedTask.id +
        '_scheduledHabit' +
        plannedTask.scheduledHabitId +
        '_timeOfDay' +
        plannedTask.timeOfDayId;

    return key;
};

export const PlanDay = () => {
    const { dayKey, plannedDay } = PlannedDayCustomHooks.useSelectedPlannedDay();
    const [elements, setElements] = React.useState<Array<PlannedTask>>([]);

    React.useEffect(() => {
        if (!plannedDay.data?.plannedTasks || plannedDay.data.plannedTasks.length === 0) {
            setElements([]);
            return;
        }

        if (plannedDay.data.plannedTasks.length < 7) {
            setElements(plannedDay.data.plannedTasks);
            return;
        }

        setElements(plannedDay.data.plannedTasks.slice(0, 7));

        const id = requestAnimationFrame(() => {
            if (plannedDay.data?.plannedTasks) {
                setElements(plannedDay.data.plannedTasks);
            }
        });

        return () => {
            cancelAnimationFrame(id);
        };
    }, [plannedDay.data]);

    const renderItem = ({ item }: { item: PlannedTask }) => (
        <View style={{ paddingBottom: TIMELINE_CARD_PADDING / 2 }}>
            <MemoizedPlannableTaskImproved initialPlannedTask={item} />
        </View>
    );

    return (
        <View style={{ height: 400, width: '100%' }}>
            <FlashList
                estimatedFirstItemOffset={0}
                estimatedItemSize={61}
                data={elements}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                removeClippedSubviews={true}
            />
        </View>
    );
};
