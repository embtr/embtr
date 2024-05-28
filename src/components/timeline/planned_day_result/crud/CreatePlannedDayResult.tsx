import { useEmbtrNavigation, useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { PlannedDayResult } from 'resources/schema';
import { EmptyScreen } from 'src/components/common/EmptyScreen';
import PlannedDayController, {
    PlannedDayCustomHooks,
} from 'src/controller/planning/PlannedDayController';
import { CreateEditPlannedDayResultBase } from './CreateEditPlannedDayResultBase';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { UserCustomHooks } from 'src/controller/user/UserController';
import { TimelineController } from 'src/controller/timeline/TimelineController';
import * as StoreReview from 'expo-store-review';

export const CreatePlannedDayResult = () => {
    const navigation = useEmbtrNavigation();
    const route = useEmbtrRoute(Routes.CREATE_PLANNED_DAY_RESULT);

    const plannedDay = PlannedDayCustomHooks.usePlannedDayForCurrentUser(route.params.dayKey);
    const currentUserId = UserCustomHooks.useCurrentUserId();

    if (!plannedDay.data) {
        return <EmptyScreen />;
    }

    const plannedDayResult: PlannedDayResult = {
        plannedDayId: plannedDay.data.id,
        plannedDay: plannedDay.data,
        description: '',
    };

    const onSubmit = async (plannedDayResult: PlannedDayResult) => {
        if (!currentUserId.data) {
            return;
        }

        await DailyResultController.create(plannedDayResult);
        DailyResultController.invalidate(plannedDayResult.id ?? 0);
        PlannedDayController.invalidatePlannedDay(currentUserId.data, route.params.dayKey);
        TimelineController.invalidateCache();

        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
            StoreReview.requestReview();
        }

        navigation.goBack();
    };

    return (
        <CreateEditPlannedDayResultBase plannedDayResult={plannedDayResult} onSubmit={onSubmit} />
    );
};
