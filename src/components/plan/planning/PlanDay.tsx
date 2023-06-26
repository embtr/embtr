import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { PlannedDay as PlannedDayModel, PlannedDayResult, PlannedTask } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannableTask } from '../PlannableTask';
import { POPPINS_REGULAR } from 'src/util/constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChallengeTabScreens } from 'src/navigation/RootStackParamList';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';

interface Props {
    plannedDay: PlannedDayModel;
    onPlannedDayUpdated: Function;
    setShowSelectTaskModal: Function;
    onSharePlannedDayResults: Function;
    showCreatePlannedDayResultsRecommendation?: boolean;
}

export const PlanDay = ({
    plannedDay,
    setShowSelectTaskModal,
    onSharePlannedDayResults,
    showCreatePlannedDayResultsRecommendation,
    onPlannedDayUpdated,
}: Props) => {
    const { colors } = useTheme();
    const navigation =
        useNavigation<StackNavigationProp<ChallengeTabScreens, 'DailyResultDetails'>>();
    const [hideRecommendationRequested, setHideRecommendationRequested] = useState<boolean>(false);

    const onPlannedTaskUpdated = (plannedTask: PlannedTask) => {
        const clonedPlannedDay = { ...plannedDay };

        clonedPlannedDay.plannedTasks = clonedPlannedDay.plannedTasks?.map((task) => {
            if (task.id === plannedTask.id) {
                return plannedTask;
            }

            return task;
        });

        onPlannedDayUpdated(clonedPlannedDay);
    };

    let taskViews: JSX.Element[] = [];
    let allTasksAreComplete = true;

    // get all current planned tasks
    plannedDay?.plannedTasks?.forEach((plannedTask) => {
        if (!plannedTask.active) {
            return;
        }

        if (plannedTask.status === 'FAILED') {
            allTasksAreComplete = false;
        }

        if (plannedTask.completedQuantity !== plannedTask.quantity) {
            allTasksAreComplete = false;
        }

        taskViews.push(
            <View
                key={plannedTask.id}
                style={{
                    paddingBottom: 5,
                    alignItems: 'center',
                    width: '97%',
                }}
            >
                <PlannableTask
                    initialPlannedTask={plannedTask}
                    onPlannedTaskUpdated={onPlannedTaskUpdated}
                />
            </View>
        );
    });

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

    const hideRecommendation =
        hideRecommendationRequested ||
        (plannedDay.hiddenPlannedDayResultRecommendations?.length &&
            plannedDay.hiddenPlannedDayResultRecommendations[0].active);

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            {taskViews.length > 0 ? (
                <View
                    style={{
                        paddingTop: 5,
                        height: '97%',
                        width: '100%',
                    }}
                >
                    {!hideRecommendation && showCreatePlannedDayResultsRecommendation && (
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
                            <Pressable
                                style={{
                                    zIndex: 1,
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    paddingRight: 5,
                                    paddingLeft: 5,
                                }}
                                onPress={async () => {
                                    if (!plannedDay.dayKey) {
                                        return;
                                    }

                                    await DailyResultController.hideCreateRecommendation(
                                        plannedDay.dayKey
                                    );
                                    setHideRecommendationRequested(true);
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 10,
                                        color: colors.secondary_text,
                                    }}
                                >
                                    hide
                                </Text>
                            </Pressable>
                            <Text style={{ color: colors.secondary_text }}>
                                {allTasksAreComplete
                                    ? 'Congratulations, you have completed your day!'
                                    : 'Finished with your day?'}
                            </Text>
                            <View style={{ flexDirection: 'row', paddingTop: 4 }}>
                                <View style={{ paddingRight: 5 }}>
                                    <Text
                                        onPress={() => {
                                            dayIsComplete
                                                ? navigateToDetails()
                                                : onSharePlannedDayResults();
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
                    )}

                    <View
                        style={{
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        {taskViews}
                    </View>
                </View>
            ) : (
                <View
                    style={{
                        height: '97%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text style={{ color: colors.secondary_text }}>
                        You have no activities planned. Let's change that!
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
                                add activities
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};
