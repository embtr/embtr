import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { MemoizedPlannableTaskImproved } from '../PlannableTaskImproved';
import { FlashList } from '@shopify/flash-list';
import { PlannedTask } from 'resources/schema';
import { Dimensions, View } from 'react-native';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { PlannableTask } from '../PlannableTask';

interface Props {
    onSharePlannedDayResults: Function;
}

const keyExtractor = (plannedTask: PlannedTask, index: number) => {
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

export const PlanDay = ({ onSharePlannedDayResults }: Props) => {
    const plannedDay = PlannedDayCustomHooks.useSelectedPlannedDay();

    const renderPlannableTask = ({ item }: { item: PlannedTask }) => {
        if (!plannedDay.data) {
            return <View />;
        }

        return (
            <View style={{ paddingBottom: TIMELINE_CARD_PADDING / 2 }}>
                <MemoizedPlannableTaskImproved plannedTask={item} />
                {/* <PlannableTask
                    plannedDay={plannedDay.data}
                    initialPlannedTask={item}
                    challengeRewards={[]}
                /> */}
            </View>
        );
    };

    return (
        <FlashList
            estimatedFirstItemOffset={0}
            estimatedItemSize={10}
            estimatedListSize={{
                height: 80 * (plannedDay.data?.plannedTasks?.length ?? 1),
                width: Dimensions.get('window').width - TIMELINE_CARD_PADDING * 2,
            }}
            data={plannedDay.data?.plannedTasks}
            renderItem={renderPlannableTask}
            keyExtractor={keyExtractor}
            removeClippedSubviews={true}
        />
    );
};
