import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { HabitSummaryCustomHooks } from 'src/controller/habit/HabitSummaryController';
import { HabitSummaries } from 'src/components/manage_habits/HabitSummaries';

export const ManageHabits = () => {
    const navigation = useEmbtrNavigation();
    const habitSummaries = HabitSummaryCustomHooks.useHabitSummaries();

    return (
        <Screen>
            <Banner
                name={'Manage Habits'}
                leftText={'close'}
                leftOnClick={() => {
                    navigation.goBack();
                }}
            />

            <HabitSummaries habitSummaries={habitSummaries.data ?? []} />
        </Screen>
    );
};
