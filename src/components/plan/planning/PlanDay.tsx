import { Text, TouchableOpacity, View } from 'react-native';
import {
    ChallengeReward,
    PlannedDay as PlannedDayModel,
    PlannedDayResult,
    PlannedTask,
} from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannableTask } from '../PlannableTask';
import { POPPINS_MEDIUM } from 'src/util/constants';

interface Props {
    plannedDay: PlannedDayModel;
    onPlannedDayUpdated: Function;
    navigateToAddTasks: Function;
    onSharePlannedDayResults: Function;
    showCreatePlannedDayResultsRecommendation?: boolean;
}

export const PlanDay = ({
    plannedDay,
    onSharePlannedDayResults,
    navigateToAddTasks,
    onPlannedDayUpdated,
}: Props) => {
    const { colors } = useTheme();

    // const [hideRecommendationRequested, setHideRecommendationRequested] = useState<boolean>(false);
    // const [userChallengeParticipation, setUserChallengeParticipation] = useState<
    //     ChallengeParticipant[]
    // >([]);

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

    //const currentUser = useAppSelector(getCurrentUser);

    // React.useEffect(() => {
    //     const fetch = async () => {
    //         if (!currentUser.id) {
    //             return;
    //         }

    //         const challengeParticipation = await ChallengeController.getAllForUser(currentUser.id);
    //         setUserChallengeParticipation(challengeParticipation ?? []);
    //     };

    //     fetch();
    // }, []);

    let taskViews: JSX.Element[] = [];
    let allTasksAreComplete = true;

    //console.log(plannedDay.plannedTasks)
    //console.log(plannedDay.date)

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
        // TODO - update this to use the new planned task/ habit concept
        /*
        for (const challengeParticipation of userChallengeParticipation) {
            const challenge = challengeParticipation.challenge;
            for (const challengeRequirement of challenge?.challengeRequirements ?? []) {
                if (challengeRequirement.taskId === plannedTask.taskId) {
                    challengeRewards.push(...(challenge?.challengeRewards ?? []));
                }
            }
        }
        */

        //keys:
        // id from template
        // id from planned task
        const key =
            'plannedTask' + plannedTask.id + '_scheduledHabit' + plannedTask.scheduledHabitId;
        //console.log('key: ' + key);

        taskViews.push(
            <View
                key={key}
                style={{
                    paddingBottom: 5,
                    alignItems: 'center',
                    width: '97%',
                }}
            >
                <PlannableTask
                    plannedDay={plannedDay}
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
                                    navigateToAddTasks();
                                }}
                                style={{
                                    color: colors.accent_color,
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
