import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { CompletedHabit } from 'resources/types/planned_day_result/PlannedDayResult';
import { CompletedHabitElement } from './CompletedHabitElement';

interface Props {
    completedHabits: CompletedHabit[];
}

export const CompletedHabits = ({ completedHabits }: Props) => {
    const renderItem = ({ item }: { item: CompletedHabit }) => {
        return (
            <View style={{ paddingRight: 18 }}>
                <CompletedHabitElement completedHabit={item} />
            </View>
        );
    };

    return <FlatList horizontal renderItem={renderItem} data={completedHabits} />;
};
