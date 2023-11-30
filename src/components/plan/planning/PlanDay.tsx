import React from 'react';
import { Dimensions, View } from 'react-native';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { MemoizedPlannableTaskImproved } from '../PlannableTaskImproved';
import { PlannedTask } from 'resources/schema';
//import { FlashList } from '@shopify/flash-list';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { FlatList } from 'react-native-gesture-handler';
import { TodayPageLayoutContext } from 'src/components/today/TodayPageLayoutContext';

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
    const todayPageLayoutContext = React.useContext(TodayPageLayoutContext);

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

    const listHeight =
        todayPageLayoutContext.planningWidgetHeight -
        todayPageLayoutContext.widgetTitleHeight -
        todayPageLayoutContext.dayPickerHeight;

    return (
        <View style={{ height: listHeight, width: '100%' }}>
            <FlatList
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
