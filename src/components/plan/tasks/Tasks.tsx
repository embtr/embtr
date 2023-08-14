import React from 'react';
import { CARD_SHADOW } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TextInput, View, Text } from 'react-native';
import TaskController from 'src/controller/planning/TaskController';
import { TaskPreview } from './TaskPreview';
import {
    ChallengeParticipant,
    ChallengeReward,
    PlannedDay as PlannedDayModel,
} from 'resources/schema';
import { Task as TaskModel } from 'resources/schema';
import { HabitController } from 'src/controller/habit/HabitController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';

interface Props {
    plannedDay: PlannedDayModel;
}

export const Tasks = ({ plannedDay }: Props) => {
    const { colors } = useTheme();

    const [searchText, setSearchText] = React.useState('');
    const [tasks, setTasks] = React.useState<TaskModel[]>([]);
    const [recentTasks, setRecentTasks] = React.useState<TaskModel[]>([]);
    const [recommendedTasks, setRecommendedTasks] = React.useState<TaskModel[]>([]);
    const [userChallengeParticipation, setUserChallengeParticipation] = React.useState<
        ChallengeParticipant[]
    >([]);

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

    React.useEffect(() => {
        if (searchText === '') {
            setTasks([]);
        }

        const debounceTimer = setTimeout(() => {
            if (searchText !== '') {
                fetchTasks(searchText);
            }
        }, 250);

        return () => {
            clearTimeout(debounceTimer);
        };
    }, [searchText]);

    const fetchRecentTasks = async () => {
        const results: TaskModel[] = await TaskController.getRecent();
        setRecentTasks(results);
    };

    const fetchRecommendedTasks = async () => {
        const results: TaskModel[] = await TaskController.getRecommended();
        setRecommendedTasks(results);
    };

    React.useEffect(() => {
        fetchRecentTasks();
        fetchRecommendedTasks();
    }, []);

    const onSearchChange = (text: string) => {
        setSearchText(text);
    };

    const fetchTasks = async (text: string) => {
        const results: TaskModel[] = await TaskController.search(text);
        setTasks(results);
    };

    const startTime = Date.now();
    const taskElements: JSX.Element[] = [];
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];

        const challengeRewards: ChallengeReward[] = [];
        for (const challengeParticipation of userChallengeParticipation) {
            const challenge = challengeParticipation.challenge;
            for (const challengeRequirement of challenge?.challengeRequirements ?? []) {
                if (challengeRequirement.taskId === task.id) {
                    challengeRewards.push(...(challenge?.challengeRewards ?? []));
                }
            }
        }

        taskElements.push(
            <View key={task.id} style={{ width: '100%', paddingTop: 7.5, alignItems: 'center' }}>
                <TaskPreview
                    plannedDay={plannedDay}
                    task={task}
                    challengeRewards={challengeRewards}
                />
            </View>
        );
    }

    if (searchText) {
        if (!tasks.find((task) => task.title?.toLowerCase() === searchText.toLowerCase())) {
            taskElements.push(
                <View
                    key={searchText}
                    style={{ width: '100%', paddingTop: 7.5, alignItems: 'center' }}
                >
                    <TaskPreview
                        plannedDay={plannedDay}
                        task={{ id: undefined, title: searchText, description: '' }}
                        challengeRewards={[]}
                    />
                </View>
            );
        }
    }

    const recentTaskElements: JSX.Element[] = [];
    if (taskElements.length === 0) {
        for (let i = 0; i < recentTasks.length; i++) {
            const task = recentTasks[i];
            const challengeRewards: ChallengeReward[] = [];
            for (const challengeParticipation of userChallengeParticipation) {
                const challenge = challengeParticipation.challenge;
                for (const challengeRequirement of challenge?.challengeRequirements ?? []) {
                    if (challengeRequirement.taskId === task.id) {
                        challengeRewards.push(...(challenge?.challengeRewards ?? []));
                    }
                }
            }

            recentTaskElements.push(
                <View
                    key={task.id}
                    style={{
                        paddingBottom: 7.5,
                        width: '100%',
                    }}
                >
                    <TaskPreview
                        plannedDay={plannedDay}
                        task={task}
                        challengeRewards={challengeRewards}
                    />
                </View>
            );
        }
    }

    const recommendedTaskElements: JSX.Element[] = [];
    if (taskElements.length === 0) {
        for (let i = 0; i < recommendedTasks.length; i++) {
            const task = recommendedTasks[i];
            const challengeRewards: ChallengeReward[] = [];
            for (const challengeParticipation of userChallengeParticipation) {
                const challenge = challengeParticipation.challenge;
                for (const challengeRequirement of challenge?.challengeRequirements ?? []) {
                    if (challengeRequirement.taskId === task.id) {
                        challengeRewards.push(...(challenge?.challengeRewards ?? []));
                    }
                }
            }
            recommendedTaskElements.push(
                <View
                    key={task.id}
                    style={{ width: '100%', paddingBottom: 7.5, alignItems: 'center' }}
                >
                    <TaskPreview
                        plannedDay={plannedDay}
                        task={task}
                        challengeRewards={challengeRewards}
                    />
                </View>
            );
        }
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                <View
                    style={[
                        {
                            backgroundColor: colors.button_background,
                            paddingTop: 10,
                            paddingBottom: 10,
                            borderRadius: 9,
                            width: '97%',
                            flexDirection: 'row',
                            alignItems: 'center',
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <View
                        style={{
                            alignContent: 'flex-end',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            position: 'absolute',
                            zIndex: -1,
                            width: '100%',
                            paddingRight: 15,
                        }}
                    >
                        <Ionicons name={'search'} size={24} color={colors.search_preview} />
                    </View>

                    <TextInput
                        style={{
                            width: '100%',
                            height: '100%',
                            color: colors.user_search_name,
                            fontSize: 16,
                            fontFamily: 'Poppins_400Regular',
                            paddingTop: 2,
                            paddingLeft: 15,
                        }}
                        onChangeText={setSearchText}
                        value={searchText}
                        placeholderTextColor={colors.search_preview}
                        placeholder={'add a habit...'}
                        autoCapitalize="none"
                    />
                </View>
            </View>

            <ScrollView
                keyboardShouldPersistTaps={'handled'}
                style={{ width: '100%', height: '100%' }}
            >
                <View style={{ paddingTop: 10, width: '100%', paddingBottom: 15 }}>
                    {taskElements}
                </View>

                {taskElements.length === 0 && (
                    <View>
                        {recentTaskElements.length > 0 && (
                            <View>
                                <Text
                                    style={{
                                        color: colors.secondary_text,
                                        paddingLeft: 5,
                                        paddingBottom: 5,
                                    }}
                                >
                                    Recent Tasks
                                </Text>
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {recentTaskElements}
                                </View>
                            </View>
                        )}

                        {recommendedTasks.length > 0 && (
                            <View style={{ paddingTop: 15 }}>
                                <Text
                                    style={{
                                        color: colors.secondary_text,
                                        paddingLeft: 5,
                                        paddingBottom: 5,
                                    }}
                                >
                                    Recommended Tasks
                                </Text>
                                <View style={{ alignItems: 'center' }}>
                                    {recommendedTaskElements}
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};
