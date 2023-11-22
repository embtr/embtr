import { HabitCategory } from 'resources/schema';
import { AddHabitElement } from './AddHabitElement';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Routes } from 'src/navigation/RootStackParamList';

interface Props {
    habitCategory: HabitCategory;
}

export const HabitCategoryElement = ({ habitCategory }: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const isCustomHabits = habitCategory.name === 'Custom Habits';

    const navigateToAddHabitCategory = () => {
        if (!habitCategory.id) {
            return;
        }

        navigation.navigate(Routes.ADD_HABIT_CATEGORY, {
            id: habitCategory.id,
            isCustomHabits: isCustomHabits,
        });
    };

    return (
        <Pressable onPress={navigateToAddHabitCategory}>
            <AddHabitElement
                imageUrl={habitCategory.imageUrl ?? ''}
                name={habitCategory.name ?? ''}
                description={habitCategory.description ?? ''}
                isCustomHabits={isCustomHabits}
            />
        </Pressable>
    );
};
