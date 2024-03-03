import { FlatList, Pressable, View } from 'react-native';
import { HabitSummary } from 'resources/types/habit/Habit';
import { HabitSummaryElement } from 'src/components/manage_habits/HabitSummaryElement';
import { Routes } from 'src/navigation/RootStackParamList';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { PADDING_LARGE, PADDING_MEDIUM } from 'src/util/constants';

interface Props {
    habitSummaries: HabitSummary[];
    showExpired?: boolean;
}

export const HabitSummaries = ({ habitSummaries, showExpired }: Props) => {
    const navigation = useEmbtrNavigation();

    const habits = showExpired
        ? habitSummaries
        : habitSummaries.filter((habitSummary) => {
            return habitSummary.nextHabitDays != undefined && habitSummary.nextHabitDays >= 0;
        });

    const renderItem = ({ item, index }: { item: HabitSummary; index: number }) => {
        return (
            <Pressable
                style={{ paddingTop: index === 0 ? 0 : PADDING_MEDIUM }}
                onPress={() => {
                    if (!item.task.id) {
                        return;
                    }

                    navigation.navigate(Routes.HABIT_SUMMARY_DETAILS, { id: item.task.id });
                }}
            >
                <HabitSummaryElement habitSummary={item} />
            </Pressable>
        );
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
