import { Text, TouchableOpacity, View } from 'react-native';
import { ChallengeReward, PlannedDayResult } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannableTask } from '../PlannableTask';
import { POPPINS_MEDIUM, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { TimeOfDayUtility } from 'src/util/time_of_day/TimeOfDayUtility';

interface Props {
    onSharePlannedDayResults: Function;
}

export const PlanDay = ({ onSharePlannedDayResults }: Props) => {
    const plannedDay = PlannedDayCustomHooks.useSelectedPlannedDay();

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

    let morningTaskViews: JSX.Element[] = [];
    let afternoonTaskViews: JSX.Element[] = [];
    let eveningTaskViews: JSX.Element[] = [];
    let nightTaskViews: JSX.Element[] = [];

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

        let arrayToAddTo = morningTaskViews;
        if (TimeOfDayUtility.isAfternoon(plannedTask.timeOfDay)) {
            arrayToAddTo = afternoonTaskViews;
        } else if (TimeOfDayUtility.isEvening(plannedTask.timeOfDay)) {
            arrayToAddTo = eveningTaskViews;
        } else if (TimeOfDayUtility.isNight(plannedTask.timeOfDay)) {
            arrayToAddTo = nightTaskViews;
        }

        arrayToAddTo.push(
            <View
                key={key}
                style={{ alignItems: 'center',
                    paddingBottom: TIMELINE_CARD_PADDING
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

    if (
        morningTaskViews.length === 0 &&
        afternoonTaskViews.length === 0 &&
        eveningTaskViews.length === 0 &&
        nightTaskViews.length === 0
    ) {
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
                {/* Morning */}
                <View
                    style={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {morningTaskViews}
                </View>

                {/* Afternoon */}
                <View
                    style={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {afternoonTaskViews}
                </View>

                {/* Evening */}
                <View
                    style={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {eveningTaskViews}
                </View>

                {/* Night */}
                <View
                    style={{
                        alignItems: 'center',
                        width: '100%',
                    }}
                >
                    {nightTaskViews}
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
                        <View style={{ width: '100%' }}>
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
