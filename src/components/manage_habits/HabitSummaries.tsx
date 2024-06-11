import { FlatList, Pressable, View } from 'react-native';
import { Routes } from 'src/navigation/RootStackParamList';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { ScheduledHabit } from 'resources/schema';
import { ScheduledHabitController } from 'src/controller/habit/ScheduledHabitController';
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

                    navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                        scheduledHabitId: item.id,
                        onExit: () => {
                            ScheduledHabitController.invalidateActiveScheduledHabits();
                        },
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
        <View style={{ flex: 1 }}>
            <FlatList data={scheduledHabits} renderItem={renderItem} keyExtractor={keyExtractor} />
        </View>
    );
};
