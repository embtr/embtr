import { FlatList, Pressable, View } from 'react-native';
import { Routes } from 'src/navigation/RootStackParamList';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { ScheduledHabit } from 'resources/schema';
import { HabitSummaryElementImproved } from './HabitSummaryElementImproved';

interface Props {
    scheduledHabits: ScheduledHabit[];
}

export const HabitSummaries = ({ scheduledHabits }: Props) => {
    const navigation = useEmbtrNavigation();

    const renderItem = ({ item, index }: { item: ScheduledHabit; index: number }) => {
        return (
            <Pressable
                onPress={() => {
                    if (!item.id) {
                        return;
                    }

                    navigation.navigate(Routes.HABIT_DETAILS, {
                        id: item.id,
                    });
                }}
            >
                <HabitSummaryElementImproved scheduledHabit={item} />
            </Pressable>
        );
    };

    const keyExtractor = (item: ScheduledHabit, index: number) => {
        return item.id ? item.id.toString() : '';
    };

    return (
        <View>
            <FlatList data={scheduledHabits} renderItem={renderItem} keyExtractor={keyExtractor} />
        </View>
    );
};
