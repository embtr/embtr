import { View, Text } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentlySelectedPlannedDay } from 'src/redux/user/GlobalState';
import { useTheme } from 'src/components/theme/ThemeProvider';
import React from 'react';
import { HabitController } from 'src/controller/habit/HabitController';
import { HabitCategory } from 'resources/schema';
import { HabitCategoryElement } from '../habit/HabitCategoryElement';

export const AddTasks = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { colors } = useTheme();

    const selectedPlannedDay = useAppSelector(getCurrentlySelectedPlannedDay);

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
        elements.push(
            <HabitCategoryElement key={habitCategory.id} habitCategory={habitCategory} />
        );
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
                <View
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {elements}
                </View>
            </View>
        </Screen>
    );
};
