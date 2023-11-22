import { Pressable, View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList, Routes } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { AddHabitElement } from './AddHabitElement';

export const AddHabitCategory = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'AddHabitCategory'>>();

    const habitCategory = HabitCustomHooks.useHabitCategory(Number(route.params.id));
    const isCustomHabits = route.params.isCustomHabits;

    const createCreateCustomHabitOption = () => {
        return createOption(
            'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/habit_categories%2Fadd.svg?alt=media',
            'Create A New Custom Habit',
            'Create a habit to start working towards your goals!'
        );
    };

    const createOption = (icon: string, title: string, description: string, taskId?: number) => {
        const isCreateCustomHabit = !taskId;

        return (
            <View key={taskId}>
                <Pressable
                    onPress={() => {
                        navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                            habitId: taskId,
                            isCreateCustomHabit,
                        });
                    }}
                >
                    <AddHabitElement imageUrl={icon} name={title} description={description} />
                </Pressable>
            </View>
        );
    };

    const elements: JSX.Element[] = [];
    if (isCustomHabits) {
        elements.push(createCreateCustomHabitOption());
    }

    habitCategory?.tasks?.forEach((task) => {
        elements.push(
            createOption(task.iconUrl ?? '', task.title ?? '', task.description ?? '', task.id)
        );
    });

    return (
        <Screen>
            <View style={{ height: '100%', width: '100%' }}>
                <Banner
                    name={habitCategory?.name ?? 'unfound'}
                    leftRoute="BACK"
                    leftIcon={'arrow-back'}
                />
                <View>{elements}</View>
            </View>
        </Screen>
    );
};
