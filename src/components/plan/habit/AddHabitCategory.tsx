import { Pressable, View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Routes } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { AddHabitElement } from './AddHabitElement';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { HabitCategoryType } from 'src/util/habit_category/HabitCategoryUtility';
import { ScrollView } from 'react-native-gesture-handler';
import { useEmbtrNavigation, useEmbtrRoute } from 'src/hooks/NavigationHooks';

interface Props {
    id?: number;
    type?: HabitCategoryType;
}

export const AddHabitCategory = ({ id, type }: Props) => {
    const navigation = useEmbtrNavigation();
    const route = useEmbtrRoute(Routes.ADD_HABIT_CATEGORY);
    const habitCategoryId = id ?? Number(route.params.id);
    const needsBanner = !id;

    const currentHabitCategory = HabitCustomHooks.useHabitCategory(habitCategoryId);

    const createOption = (
        optimalImageData: OptimalImageData,
        title: string,
        description: string,
        taskId?: number
    ) => {
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
                    <AddHabitElement
                        optimalImageData={optimalImageData}
                        name={title}
                        description={description}
                    />
                </Pressable>
            </View>
        );
    };

    const elements: JSX.Element[] = [];

    currentHabitCategory?.tasks?.forEach((task) => {
        console.log(task);
        const optimalImageData: OptimalImageData = {
            icon: task.icon,
        };

        elements.push(
            createOption(optimalImageData, task.title ?? '', task.description ?? '', task.id)
        );
    });

    return (
        <Screen>
            <View style={{ height: '100%', width: '100%' }}>
                {needsBanner && (
                    <Banner
                        name={currentHabitCategory?.name ?? ''}
                        leftRoute="BACK"
                        leftIcon={'arrow-back'}
                    />
                )}

                <ScrollView>
                    <View>{elements}</View>
                    <View style={{ height: 100 }} />
                </ScrollView>
            </View>
        </Screen>
    );
};
