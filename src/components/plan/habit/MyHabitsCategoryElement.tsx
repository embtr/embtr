import { Screen } from 'src/components/common/Screen';
import { View } from 'react-native';
import { AddHabitCategory } from 'src/components/plan/habit/AddHabitCategory';
import { HabitCategoryType } from 'src/util/habit_category/HabitCategoryUtility';
import { Banner } from 'src/components/common/Banner';

const MY_HABITS_CATEGORY_ID = 15;
export const MyHabitsCategoryElement = () => {
    return (
        <Screen>
            <Banner name={'My Habits'} leftRoute="BACK" leftText={'close'} />

            <View>
                <AddHabitCategory id={MY_HABITS_CATEGORY_ID} type={HabitCategoryType.MY_HABITS} />
            </View>
        </Screen>
    );
};
