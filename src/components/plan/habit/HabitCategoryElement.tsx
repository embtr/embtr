import { HabitCategory } from 'resources/schema';
import { AddHabitElement } from './AddHabitElement';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';

interface Props {
    habitCategory: HabitCategory;
}

export const HabitCategoryElement = ({ habitCategory }: Props) => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    return (
        <Pressable
            onPress={() => {
                navigation.navigate('AddHabitCategory', { id: habitCategory.id ?? 0 });
            }}
        >
            <AddHabitElement
                imageUrl={habitCategory.imageUrl ?? ''}
                name={habitCategory.name ?? ''}
                description={habitCategory.description ?? ''}
            />
        </Pressable>
    );
};
