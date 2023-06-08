import * as React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TouchableWithoutFeedback } from 'react-native';
import { TaskFailedSymbol } from '../task_symbols/TaskFailedSymbol';
import { TaskCompleteSymbol } from '../task_symbols/TaskCompleteSymbol';
import { TaskInProgressSymbol } from '../task_symbols/TaskInProgressSymbol';
import { PlannedTask as PlannedTaskModel } from 'resources/schema';
import { POPPINS_REGULAR } from 'src/util/constants';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { getTodayKey } from 'src/controller/planning/PlannedDayController';

interface Props {
    plannedTask: PlannedTaskModel;
    onPress?: Function;
}

export const DailyResultCardElement = ({ plannedTask, onPress }: Props) => {
    const { colors } = useTheme();
    const [temporaryStatus, setTemporaryStatus] = React.useState('');

    const taskIsFailed = plannedTask.status === 'FAILED';

    const quantity = plannedTask.quantity;
    const completedQuantity = plannedTask.completedQuantity;

    let taskIsComplete = false;
    let progress = 0;
    if (quantity && completedQuantity) {
        progress = completedQuantity / quantity;
        taskIsComplete = quantity === completedQuantity;
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
        status = 'INCOMPLETE';
    }

    //clear status once render catches up
    if (plannedTask.status === temporaryStatus) {
        setTemporaryStatus('');
    }

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableWithoutFeedback
                disabled={!onPress}
                onPress={() => {
                    if (onPress) {
                        onPress(plannedTask, status, setTemporaryStatus);
                    }
                }}
            >
                {icon}
            </TouchableWithoutFeedback>

            <View style={{ flex: 1 }}>
                <Text
                    style={{
                        color: colors.goal_primary_font,
                        fontFamily: 'Poppins_600SemiBold',
                        fontSize: 12,
                        lineHeight: 14,
                        paddingLeft: 5,
                    }}
                >
                    {plannedTask.task?.title}
                </Text>

                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 5,
                        }}
                    >
                        <ProgressBar
                            progress={progress * 100}
                            success={taskIsComplete}
                            showPercent={false}
                        />
                    </View>

                    <View
                        style={{
                            flex: 3,
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: 10,
                        }}
                    >
                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 10,
                            }}
                        >
                            {'todo complete'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
