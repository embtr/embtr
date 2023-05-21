import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { PlannedDay as PlannedDayModel, PlannedDayResult } from 'resources/schema';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannableTask } from '../PlannableTask';
import { POPPINS_REGULAR } from 'src/util/constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    plannedDay: PlannedDayModel;
    onTaskUpdated: Function;
    setShowSelectTaskModal: Function;
    onCompleteDay: Function;
}

export const PlanDay = ({
    plannedDay,
    onTaskUpdated,
    setShowSelectTaskModal,
    onCompleteDay,
}: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens, 'DailyResultDetails'>>();
    const [taskViews, setTaskViews] = useState<JSX.Element[]>([]);
    const [allTasksAreComplete, setAllTasksAreComplete] = useState<boolean>(false);

    useEffect(() => {
        let taskViews: JSX.Element[] = [];
        let allTasksAreComplete = true;

        // get all current planned tasks
        plannedDay?.plannedTasks?.forEach((plannedTask) => {
            if (
                !(
                    plannedTask.count === plannedTask.completedCount &&
                    (plannedTask.count ?? 0) > 0 &&
                    plannedTask.status !== 'FAILED'
                )
            ) {
                allTasksAreComplete = false;
            }
            taskViews.push(
                <View
                    key={plannedTask.id + '_locked'}
                    style={{
                        paddingBottom: 5,
                        alignItems: 'center',
                        width: '97%',
                    }}
                >
                    <PlannableTask plannedTask={plannedTask} onUpdateTask={onTaskUpdated} />
                </View>
            );
        });

        setTaskViews(taskViews);
        setAllTasksAreComplete(allTasksAreComplete);
    }, [plannedDay]);

    let dayIsComplete = false;
    const plannedDayResult: PlannedDayResult | undefined = plannedDay.plannedDayResults?.[0];
    if (plannedDayResult) {
        dayIsComplete = plannedDayResult.active ?? false;
    }

    const navigateToDetails = () => {
        if (!plannedDay?.plannedDayResults?.length) {
            return;
        }

        if (!plannedDay.plannedDayResults[0].id) {
            return;
        }

        navigation.navigate('DailyResultDetails', {
            id: plannedDay.plannedDayResults[0].id,
        });
    };

    return (
        <Screen>
            <View style={{ flex: 1, flexDirection: 'column' }}>
                {taskViews.length > 0 ? (
                    <ScrollView
                        style={{
                            backgroundColor: colors.background,
                            paddingTop: 5,
                            height: '97%',
                            width: '100%',
                        }}
                    >
                        <View
                            style={{
                                marginBottom: 20,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 1,
                                borderColor: colors.secondary_text,
                                borderRadius: 5,
                                width: '97%',
                                paddingTop: 5,
                                paddingBottom: 5,
                                marginLeft: '1.5%',
                            }}
                        >
                            <Text
                                style={{
                                    zIndex: 1,
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    paddingRight: 5,
                                    paddingLeft: 5,
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 10,
                                    color: colors.secondary_text,
                                }}
                            >
                                hide
                            </Text>
                            <Text style={{ color: colors.secondary_text }}>
                                {allTasksAreComplete
                                    ? 'Congratulations, you have completed your day!'
                                    : 'Finished with your day?'}
                            </Text>
                            <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                <View style={{ paddingRight: 5 }}>
                                    <Text
                                        onPress={() => {
                                            dayIsComplete ? navigateToDetails() : onCompleteDay();
                                        }}
                                        style={{
                                            color: colors.tab_selected,
                                            fontFamily: 'Poppins_400Regular',
                                        }}
                                    >
                                        {' '}
                                        {dayIsComplete ? 'View Shared Results' : 'Share Results'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View
                            style={{
                                alignItems: 'center',
                                width: '100%',
                            }}
                        >
                            {taskViews}
                        </View>
                    </ScrollView>
                ) : (
                    <View
                        style={{
                            height: '97%',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: colors.secondary_text }}>
                            You have no tasks planned. Let's change that!
                        </Text>
                        <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                            <View style={{ paddingRight: 5 }}>
                                <Text
                                    onPress={() => {
                                        setShowSelectTaskModal(true);
                                    }}
                                    style={{
                                        color: colors.tab_selected,
                                        fontFamily: 'Poppins_400Regular',
                                    }}
                                >
                                    {' '}
                                    create a task
                                </Text>
                            </View>
                        </View>
                    </View>
                )}
            </View>
        </Screen>
    );
};
