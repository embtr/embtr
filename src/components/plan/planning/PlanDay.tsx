import React from 'react';
import { View, Text } from 'react-native';
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
    dayKey: string;
    hideComplete?: boolean;
}

export const PlanDay = ({ plannedDay, hideComplete, dayKey }: Props) => {
    const { colors } = useTheme();
    const [elements, setElements] = React.useState<Array<PlannedTask>>([]);

    const hasPlannedTasks = plannedDay.plannedTasks && plannedDay.plannedTasks.length > 0;
    const allHabitsAreComplete =
        hasPlannedTasks &&
        plannedDay.plannedTasks?.reduce(
            (acc, task) => acc && (task.completedQuantity ?? 0) >= (task.quantity ?? 1),
            true
        );

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

    let header = undefined;
    if (allHabitsAreComplete) {
        header = (
            <View
                style={{
                    padding: TIMELINE_CARD_PADDING / 2,
                    marginBottom: TIMELINE_CARD_PADDING,
                    borderColor: '#404040',
                    backgroundColor: '#343434',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: 5,
                }}
            >
                <Text
                    style={{
                        lineHeight: 20,
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                        textAlign: 'center',
                    }}
                >
                    All of today's habits are complete 🎉
                </Text>

                <View style={{ height: TIMELINE_CARD_PADDING }} />

                <View
                    style={{
                        backgroundColor: colors.accent_color,
                        borderRadius: 2.5,
                    }}
                >
                    <Text
                        style={{
                            paddingVertical: TIMELINE_CARD_PADDING / 8,
                            lineHeight: 20,
                            color: colors.text,
                            textAlign: 'center',
                            fontFamily: POPPINS_REGULAR,
                        }}
                    >
                        Share your results
                    </Text>
                </View>
            </View>
        );
    } else if (!hasPlannedTasks) {
        header = (
            <View
                style={{
                    padding: TIMELINE_CARD_PADDING / 2,
                    marginBottom: TIMELINE_CARD_PADDING,
                    borderColor: '#404040',
                    borderWidth: 1,
                    justifyContent: 'center',
                    alignContent: 'center',
                    borderRadius: 5,
                }}
            >
                <Text
                    style={{
                        lineHeight: 20,
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                    }}
                >
                    No habits planned for today
                </Text>
            </View>
        );
    }

    const renderItem = ({ item }: { item: PlannedTask }) => (
        <View style={{ paddingBottom: TIMELINE_CARD_PADDING / 2 }}>
            <MemoizedPlannableTaskImproved initialPlannedTask={item} dayKey={dayKey} />
        </View>
    );

    return (
        <View style={{ width: '100%' }}>
            {header}

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
