import { HabitCategory } from 'resources/schema';
import { AddHabitElement } from './AddHabitElement';
import { Pressable } from 'react-native';
import { Routes } from 'src/navigation/RootStackParamList';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';

interface Props {
    habitCategory: HabitCategory;
}

export const HabitCategoryElement = ({ habitCategory }: Props) => {
    const navigation = useEmbtrNavigation();

    const navigateToAddHabitCategory = () => {
        if (!habitCategory.id) {
            return;
        }

        navigation.navigate(Routes.ADD_HABIT_CATEGORY, {
            id: habitCategory.id,
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
            />
        </Pressable>
    );
};
