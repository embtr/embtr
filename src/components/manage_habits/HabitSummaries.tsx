import { FlatList, View } from 'react-native';
import { HabitSummary } from 'resources/types/habit/Habit';
import { HabitSummaryElement } from 'src/components/manage_habits/HabitSummaryElement';

interface Props {
    habitSummaries: HabitSummary[];
    showExpired?: boolean;
}

export const HabitSummaries = ({ habitSummaries, showExpired }: Props) => {
    const habits = showExpired
        ? habitSummaries
        : habitSummaries.filter((habitSummary) => {
              return habitSummary.nextHabitDays != undefined && habitSummary.nextHabitDays >= 0;
          });

    const renderItem = ({ item }: { item: HabitSummary }) => {
        return <HabitSummaryElement habitSummary={item} />;
    };

    const keyExtractor = (item: HabitSummary, index: number) => {
        return item.task.id ? item.task.id.toString() : '';
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList data={habits} renderItem={renderItem} keyExtractor={keyExtractor} />
        </View>
    );
};
