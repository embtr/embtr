import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { CompletedHabit } from 'resources/types/planned_day_result/PlannedDayResult';
import { CompletedHabitElement } from './CompletedHabitElement';

interface Props {
    completedHabits: CompletedHabit[];
    limit?: number;
}

export const CompletedHabits = ({ completedHabits, limit }: Props) => {
    const renderItem = ({ item }: { item: CompletedHabit }) => {
        return (
            <View style={{ paddingRight: 18 }}>
                <CompletedHabitElement completedHabit={item} />
            </View>
        );
    };

    return (
        <FlatList
            horizontal
            enabled={false}
            renderItem={renderItem}
            data={completedHabits.slice(0, limit)}
            showsHorizontalScrollIndicator={false}
        />
    );
};
