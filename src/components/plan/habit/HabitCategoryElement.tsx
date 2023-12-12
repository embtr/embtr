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
    const isActiveHabits = habitCategory.name === 'Active Habits';
    const highlightElement = isCustomHabits || isActiveHabits;

    const navigateToAddHabitCategory = () => {
        if (!habitCategory.id) {
            return;
        }

        const type: HabitCategoryType = isCustomHabits
            ? HabitCategoryType.CUSTOM_HABITS
            : isActiveHabits
              ? HabitCategoryType.ACTIVE_HABITS
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
