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

    const elements: JSX.Element[] = [];
    habitCategory?.tasks?.forEach((task) => {
        elements.push(
            <View key={task.id}>
                <Pressable
                    onPress={() => {
                        navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                            habitId: task.id,
                        });
                    }}
                >
                    <AddHabitElement
                        imageUrl={task.iconUrl ?? ''}
                        name={task.title ?? ''}
                        description={task.description ?? ''}
                    />
                </Pressable>
            </View>
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
