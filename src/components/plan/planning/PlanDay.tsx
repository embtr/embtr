import React from 'react';
import { Dimensions, View } from 'react-native';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { MemoizedPlannableTaskImproved } from '../PlannableTaskImproved';
import { PlannedTask } from 'resources/schema';
import { FlashList } from '@shopify/flash-list';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { set } from 'lodash';

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

        requestAnimationFrame(() => {
            if (plannedDay.data?.plannedTasks) {
                setElements(plannedDay.data.plannedTasks);
            }
        });
    }, [plannedDay.data]);

    const renderItem = ({ item }: { item: PlannedTask }) => (
        <MemoizedPlannableTaskImproved initialPlannedTask={item} key={keyExtractor(item)} />
    );

    return (
        <View style={{ height: 300, width: '100%' }}>
            <FlashList
                estimatedFirstItemOffset={TIMELINE_CARD_PADDING}
                estimatedItemSize={300}
                estimatedListSize={{
                    height: 80 * Math.min(elements.length ?? 1, 5),
                    width: Dimensions.get('window').width - TIMELINE_CARD_PADDING * 2,
                }}
                data={elements}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                removeClippedSubviews={true}
            />
        </View>
    );
};
