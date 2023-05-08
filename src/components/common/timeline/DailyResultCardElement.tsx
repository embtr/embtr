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

interface Props {
    plannedTask: PlannedTaskModel;
    onPress?: Function;
}

export const DailyResultCardElement = ({ plannedTask, onPress }: Props) => {
    const { colors } = useTheme();
    const [temporaryStatus, setTemporaryStatus] = React.useState('');

    const totalCount = plannedTask?.count ?? 1;
    const completedCount = plannedTask?.completedCount ?? 0;
    const taskIsComplete = completedCount === totalCount;
    const taskIsFailed = plannedTask.status === 'FAILED';

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
                {taskIsFailed || !taskIsComplete ? <TaskFailedSymbol /> : <TaskCompleteSymbol />}
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
                            progress={(completedCount / totalCount) * 100}
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
                            {completedCount}
                            {'/'}
                            {totalCount}
                            {' complete'}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};
