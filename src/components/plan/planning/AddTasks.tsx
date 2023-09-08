import React from 'react';
import { View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import { HabitController } from 'src/controller/habit/HabitController';
import { HabitCategory } from 'resources/schema';
import { HabitCategoryElement } from '../habit/HabitCategoryElement';
import { ScrollView } from 'react-native-gesture-handler';

export const AddTasks = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const [habitCategories, setHabitCategories] = React.useState<HabitCategory[]>([]);
    console.log(habitCategories);

    React.useEffect(() => {
        const fetch = async () => {
            const habitCategories = await HabitController.getHabitCategories();
            if (habitCategories) {
                setHabitCategories(habitCategories);
            }
        };

        fetch();
    }, []);

    const elements: JSX.Element[] = [];
    habitCategories.forEach((habitCategory) => {
        elements.push(<HabitCategoryElement habitCategory={habitCategory} />);
    });

    return (
        <Screen>
            <View style={{ height: '100%', width: '100%' }}>
                <Banner
                    name="Add Habits"
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
