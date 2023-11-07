import { Text, TouchableOpacity, View } from 'react-native';
import { ChallengeReward, PlannedDayResult } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannableTask } from '../PlannableTask';
import { POPPINS_MEDIUM } from 'src/util/constants';
import { useAppSelector } from 'src/redux/Hooks';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { getCurrentUser, getSelectedDayKey } from 'src/redux/user/GlobalState';

interface Props {
    navigateToAddTasks: Function;
    onSharePlannedDayResults: Function;
    showCreatePlannedDayResultsRecommendation?: boolean;
}

export const PlanDay = ({
    onSharePlannedDayResults,
    navigateToAddTasks,
}: Props) => {
    const currentUser = useAppSelector(getCurrentUser);
    const dayKey = useAppSelector(getSelectedDayKey);
    const plannedDay = PlannedDayCustomHooks.usePlannedDay(currentUser.id ?? 0, dayKey);

    const { colors } = useTheme();

    // const [hideRecommendationRequested, setHideRecommendationRequested] = useState<boolean>(false);
    // const [userChallengeParticipation, setUserChallengeParticipation] = useState<
    //     ChallengeParticipant[]
    // >([]);

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

    // get all current planned tasks
    plannedDay.data?.plannedTasks?.forEach((plannedTask) => {
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
            'plannedTask' +
            plannedTask.id +
            '_scheduledHabit' +
            plannedTask.scheduledHabitId +
            '_timeOfDay' +
            plannedTask.timeOfDayId;

        taskViews.push(
            <View
                key={key}
                style={{
                    alignItems: 'center',
                    width: '97%',
                }}
            >
                <PlannableTask
                    plannedDay={plannedDay.data!}
                    challengeRewards={challengeRewards}
                    initialPlannedTask={plannedTask}
                />
            </View>
        );
    });

    let dayIsComplete = false;
    const plannedDayResult: PlannedDayResult | undefined = plannedDay.data?.plannedDayResults?.[0];
    if (plannedDayResult) {
        dayIsComplete = plannedDayResult.active ?? false;
    }

    if (taskViews.length === 0) {
        return (
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text style={{ color: colors.secondary_text }}>
                    You have no activities planned. Let's change that!
                </Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
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
        </View>
    );
};
