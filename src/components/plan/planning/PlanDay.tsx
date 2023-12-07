import React from 'react';
import { View, Text } from 'react-native';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { MemoizedPlannableTaskImproved } from '../PlannableTaskImproved';
import { PlannedDay, PlannedTask } from 'resources/schema';
//import { FlashList } from '@shopify/flash-list';
import { POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { FlatList } from 'react-native-gesture-handler';
import { PlanningService } from 'src/util/planning/PlanningService';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const keyExtractor = (plannedTask: PlannedTask) => {
    const key = PlanningService.getPlannedHabitUniqueKey(plannedTask);
    return key;
};

interface Props {
    plannedDay: PlannedDay;
    hideComplete?: boolean;
}

export const PlanDay = ({ plannedDay, hideComplete }: Props) => {
    const { colors } = useTheme();

    const [elements, setElements] = React.useState<Array<PlannedTask>>([]);

    React.useEffect(() => {
        console.log('hideComplete', hideComplete);
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
            <MemoizedPlannableTaskImproved initialPlannedTask={item} />
        </View>
    );

    if (elements.length === 0) {
        return (
            <View style={{ paddingVertical: TIMELINE_CARD_PADDING }}>
                <Text style={{ color: colors.secondary_text, fontFamily: POPPINS_REGULAR }}>
                    Nothing planned for today.
                </Text>
            </View>
        );
    }

    return (
        <View style={{ width: '100%' }}>
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
