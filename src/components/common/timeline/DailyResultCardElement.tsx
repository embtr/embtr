import * as React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TaskFailedSymbol } from '../task_symbols/TaskFailedSymbol';
import { TaskCompleteSymbol } from '../task_symbols/TaskCompleteSymbol';
import { TaskInProgressSymbol } from '../task_symbols/TaskInProgressSymbol';
import { PlannedTask as PlannedTaskModel } from 'resources/schema';
import { POPPINS_REGULAR } from 'src/util/constants';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { getTodayKey } from 'src/controller/planning/PlannedDayController';
import { UnitUtility } from 'src/util/UnitUtility';
import { HabitIcon } from 'src/components/plan/habit/HabitIcon';
import { OptimalImageData } from '../images/OptimalImage';
import { Constants } from 'resources/types/constants/constants';

interface Props {
    plannedTask: PlannedTaskModel;
    onPress?: Function;
}

export const DailyResultCardElement = ({ plannedTask, onPress }: Props) => {
    const { colors } = useTheme();
    const [temporaryStatus, setTemporaryStatus] = React.useState('');

    const taskIsFailed = plannedTask.status === Constants.HabitStatus.FAILED;

    const unit = plannedTask.unit;
    const quantity = plannedTask.quantity;
    const completedQuantity = plannedTask.completedQuantity;

    let taskIsComplete = false;
    let progress = 0;
    if (quantity && completedQuantity) {
        progress = completedQuantity / quantity;
        taskIsComplete = completedQuantity >= quantity;
    }

    let icon: JSX.Element = <TaskFailedSymbol />;
    if (taskIsComplete) {
        icon = <TaskCompleteSymbol />;
    } else if (
        plannedTask.plannedDay?.dayKey === getTodayKey() &&
        !taskIsComplete &&
        !taskIsFailed
    ) {
        icon = <TaskInProgressSymbol />;
    }

    let status = plannedTask.status;
    if (temporaryStatus) {
        status = temporaryStatus;
    }
    if (status === undefined) {
        status = Constants.HabitStatus.INCOMPLETE;
    }

    //clear status once render catches up
    if (plannedTask.status === temporaryStatus) {
        setTemporaryStatus('');
    }

    let stats = `${completedQuantity} / ${quantity}`;
    if (taskIsComplete) {
        stats = `${completedQuantity}`;
    }

    let units = '';
    if (unit) {
        units = UnitUtility.getReadableUnit(
            unit,
            completedQuantity === quantity ? completedQuantity ?? 0 : 0
        );
    }

    if (!units) {
        units = 'Completed';
    }

    const statText = `${stats} ${units}`;

    const optimalImageData: OptimalImageData = {
        remoteImageUrl: plannedTask.remoteImageUrl,
    };


    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{}}>{icon}</View>

            <View style={{ flex: 1, paddingLeft: 7.5 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={{
                            color: colors.goal_primary_font,
                            fontFamily: 'Poppins_600SemiBold',
                            fontSize: 12,
                            includeFontPadding: false,
                        }}
                    >
                        {plannedTask?.title}{' '}
                    </Text>
                    <View style={{ paddingLeft: 2.5 }}>
                        {plannedTask.remoteImageUrl && (
                            <HabitIcon
                                optimalImageData={optimalImageData}
                                size={15}
                                color={colors.tab_selected}
                            />
                        )}
                    </View>
                </View>

                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        paddingTop: 2.5,
                    }}
                >
                    <View
                        style={{
                            flex: 1.5,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <ProgressBar
                            progress={Math.min(100, progress * 100)}
                            showPercent={false}
                        />
                    </View>
                    <Text
                        style={{
                            paddingLeft: 5,
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 10,
                            includeFontPadding: false,
                        }}
                    >
                        {statText}
                    </Text>

                    <View style={{ flex: 2 }} />
                </View>
            </View>
        </View>
    );
};
