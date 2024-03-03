import { HabitCategory } from 'resources/schema';
import { AddHabitElement } from './AddHabitElement';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Routes } from 'src/navigation/RootStackParamList';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { HabitCategoryType } from 'src/util/habit_category/HabitCategoryUtility';

interface Props {
    habitCategory: HabitCategory;
}

export const HabitCategoryElement = ({ habitCategory }: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const isCustomHabits = habitCategory.name === 'Custom Habits';
    const isRecentHabits = habitCategory.name === 'Recent Habits';
    const isMyHabits = habitCategory.name === 'My Habits';
    const highlightElement = isCustomHabits || isRecentHabits || isMyHabits;

    const navigateToAddHabitCategory = () => {
        if (!habitCategory.id) {
            return;
        }

        const type: HabitCategoryType = isCustomHabits
            ? HabitCategoryType.CUSTOM_HABITS
            : isRecentHabits
                ? HabitCategoryType.RECENT_HABITS
                : isMyHabits
                    ? HabitCategoryType.MY_HABITS
                    : HabitCategoryType.HABIT_CATEGORY;

        navigation.navigate(Routes.ADD_HABIT_CATEGORY, {
            id: habitCategory.id,
            type: type,
        });
    };

    const optimalImageData: OptimalImageData = {
        remoteImageUrl: habitCategory.remoteImageUrl,
    };

    return (
        <Pressable onPress={navigateToAddHabitCategory}>
            <AddHabitElement
                optimalImageData={optimalImageData}
                name={habitCategory.name ?? ''}
                description={habitCategory.description ?? ''}
                highlightElement={highlightElement}
            />
        </Pressable>
    );
};
