import DailyResultController, {
    PlannedDayResultCustomHooks,
} from 'src/controller/timeline/daily_result/DailyResultController';
import { useEmbtrNavigation, useEmbtrRoute } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { CreateEditPlannedDayResultBase } from './CreateEditPlannedDayResultBase';
import { EmptyScreen } from 'src/components/common/EmptyScreen';
import { PlannedDayResult } from 'resources/schema';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import { TimelineController } from 'src/controller/timeline/TimelineController';

export const EditPlannedDayResult = () => {
    const navigation = useEmbtrNavigation();
    const route = useEmbtrRoute(Routes.EDIT_PLANNED_DAY_RESULT);

    const plannedDayResult = PlannedDayResultCustomHooks.usePlannedDayResult(route.params.id);
    if (!plannedDayResult.data) {
        return <EmptyScreen />;
    }

    const onSubmit = async (plannedDayResult: PlannedDayResult) => {
        await DailyResultController.updateViaApi(plannedDayResult);
        DailyResultController.invalidate(plannedDayResult.id ?? 0);
        PlannedDayController.invalidatePlannedDay(
            plannedDayResult.plannedDay?.userId ?? 0,
            plannedDayResult.plannedDay?.dayKey ?? ''
        );
        TimelineController.invalidateCache();

        navigation.goBack();
    };

    return (
        <CreateEditPlannedDayResultBase
            plannedDayResult={plannedDayResult.data}
            onSubmit={onSubmit}
        />
    );
};
