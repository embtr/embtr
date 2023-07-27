import { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
    Challenge,
    ChallengeParticipant,
    ChallengeReward,
    PlannedDay as PlannedDayModel,
    PlannedDayResult,
    PlannedTask,
} from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannableTask } from '../PlannableTask';
import { POPPINS_MEDIUM, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChallengeTabScreens } from 'src/navigation/RootStackParamList';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import React from 'react';

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
    const [userChallengeParticipation, setUserChallengeParticipation] = useState<
        ChallengeParticipant[]
    >([]);

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

    const currentUser = useAppSelector(getCurrentUser);

    React.useEffect(() => {
        const fetch = async () => {
            if (!currentUser.id) {
                return;
            }

            const challengeParticipation = await ChallengeController.getAllForUser(currentUser.id);
            setUserChallengeParticipation(challengeParticipation ?? []);
        };

        fetch();
    }, []);

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

        if ((plannedTask.completedQuantity ?? 0) < (plannedTask.quantity ?? 0)) {
            allTasksAreComplete = false;
        }

        const challengeRewards: ChallengeReward[] = [];
        for (const challengeParticipation of userChallengeParticipation) {
            const challenge = challengeParticipation.challenge;
            for (const challengeRequirement of challenge?.challengeRequirements ?? []) {
                if (challengeRequirement.taskId === plannedTask.taskId) {
                    challengeRewards.push(...(challenge?.challengeRewards ?? []));
                }
            }
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
                    challengeRewards={challengeRewards}
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
                    <View
                        style={{
                            alignItems: 'center',
                            width: '100%',
                        }}
                    >
                        {taskViews}
                    </View>
                    {!dayIsComplete && (
                        <View
                            style={{
                                width: '100%',
                                paddingTop: 15,
                                paddingBottom: 5,
                                alignItems: 'center',
                            }}
                        >
                            <View style={{ width: '97%' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        onSharePlannedDayResults();
                                    }}
                                    style={{
                                        borderRadius: 5,
                                        backgroundColor: colors.tab_selected,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: colors.text,
                                            fontFamily: POPPINS_MEDIUM,
                                            paddingTop: 8,
                                            paddingBottom: 5,
                                            textAlign: 'center',
                                        }}
                                    >
                                        Share Your Day!
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
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
