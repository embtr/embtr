import { Screen } from 'src/components/common/Screen';
import { View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { AddHabitCategory } from 'src/components/plan/habit/AddHabitCategory';
import { HabitCategoryType } from 'src/util/habit_category/HabitCategoryUtility';

const MY_HABITS_CATEGORY_ID = 15;
export const MyHabitsCategoryElement = () => {
    return (
        <Screen>
            <View>
                <AddHabitCategory id={15} type={HabitCategoryType.MY_HABITS} />
            </View>
        </Screen>
    );
};
