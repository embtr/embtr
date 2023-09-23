import { View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import { HabitCategoryElement } from '../habit/HabitCategoryElement';
import { ScrollView } from 'react-native-gesture-handler';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';

export const AddHabitCategory = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const habitCategories = HabitCustomHooks.useHabitCategories();

    const elements: JSX.Element[] = [];
    habitCategories.forEach((habitCategory) => {
        elements.push(
            <HabitCategoryElement key={habitCategory.id} habitCategory={habitCategory} />
        );
    });

    return (
        <Screen>
            <View style={{ height: '100%', width: '100%' }}>
                <Banner
                    name="Habit Categories"
                    leftText="close"
                    leftOnClick={() => {
                        navigation.goBack();
                    }}
                />
                <ScrollView style={{ width: '100%', height: '100%' }}>{elements}</ScrollView>
            </View>
        </Screen>
    );
};
