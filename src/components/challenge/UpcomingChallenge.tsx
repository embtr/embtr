import React from 'react';
import { CARD_SHADOW, PADDING_SMALL, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';
import { ChallengeRewardView } from './ChallengeRewardView';
import { ChallengeUtility } from 'src/util/challenge/ChallengeUtility';
import { ScheduledHabitController } from 'src/controller/habit/ScheduledHabitController';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import { useAppSelector } from 'src/redux/Hooks';
import { getSelectedDayKey } from 'src/redux/user/GlobalState';
import { ChallengeSummary } from 'resources/types/dto/Challenge';
import { ChallengeSummaryInteractableElementCustomHooks } from '../timeline/interactable/ChallengeSummaryInteractableElementCustomHooks';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';

interface Props {
    challengeSummary: ChallengeSummary;
}

export const UpcomingChallenge = ({ challengeSummary }: Props) => {
    const { colors } = useTheme();
    const navigation = useEmbtrNavigation();

    const [userIsAParticipant, setUsetIsAParticipant] = React.useState(
        challengeSummary.isParticipant
    );
    const [participantCount, setParticipantCount] = React.useState(
        challengeSummary.participantCount
    );
    const currentlySelectedDay = useAppSelector(getSelectedDayKey);

    const interactableData =
        ChallengeSummaryInteractableElementCustomHooks.useInteractableElement(challengeSummary);

    const daysUntilStart = Math.floor(
        ((challengeSummary.start ?? new Date()).getTime() - new Date().getTime()) / 86400000
    );

    const daysRemaining = Math.floor(
        ((challengeSummary.end ?? new Date()).getTime() - new Date().getTime()) / 86400000
    );

    const totalDays = Math.floor(
        ((challengeSummary.end ?? new Date()).getTime() -
            (challengeSummary.start ?? new Date()).getTime()) /
        86400000
    );

    const registerForChallenge = async () => {
        if (!challengeSummary.id) {
            return;
        }

        const currentUserId = await getUserIdFromToken();
        await ChallengeController.register(challengeSummary.id);
        ScheduledHabitController.invalidateActiveScheduledHabits();
        if (currentUserId && currentlySelectedDay) {
            PlannedDayController.invalidatePlannedDay(currentUserId, currentlySelectedDay);
        }

        setUsetIsAParticipant(true);
        setParticipantCount(participantCount + 1);
    };

    return (
        <Pressable
            key={challengeSummary.id}
            onPress={() => {
                if (!challengeSummary.id) {
                    return;
                }

                ChallengeSummaryInteractableElementCustomHooks.createEventListeners(
                    challengeSummary,
                    interactableData
                );
                navigation.navigate(Routes.CHALLENGE_DETAILS, { id: challengeSummary.id });
            }}
            style={{
                ...CARD_SHADOW, // Assuming CARD_SHADOW is the style for card shadow
            }}
        >
            <View
                style={{
                    backgroundColor: colors.card_background,
                    width: '100%',
                    height: 280,
                    borderRadius: 9,
                }}
            >
                {/* TOP SECTION */}
                <View style={{ padding: 10 }}>
                    {/* HEADER */}
                    <View>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 12,
                                height: 20,
                            }}
                        >
                            {challengeSummary.name}
                        </Text>

                        <View>
                            <Text
                                style={{
                                    fontFamily: POPPINS_REGULAR,
                                    color: colors.secondary_text,
                                    fontSize: 8,
                                    bottom: 4,
                                }}
                            >
                                {participantCount} participant{participantCount === 1 ? '' : 's'} •{' '}
                                <Text
                                    style={{
                                        paddingTop: 2,
                                        fontFamily: POPPINS_REGULAR,
                                        color: colors.tab_selected,
                                        fontSize: 8,
                                    }}
                                >
                                    {ChallengeUtility.getDaysRemainingText(
                                        daysUntilStart,
                                        daysRemaining
                                    )}
                                </Text>{' '}
                                • {totalDays}
                                {' days'}
                            </Text>
                        </View>

                        <Text
                            numberOfLines={2}
                            style={{
                                fontFamily: POPPINS_REGULAR,
                                color: colors.text,
                                fontSize: 10,
                            }}
                        >
                            {challengeSummary.description}
                        </Text>
                    </View>
                </View>

                {/* BOTTOM SECTION */}
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        bottom: 5,
                        alignContent: 'center',
                    }}
                >
                    {/* Achievement */}
                    <View
                        style={{
                            flexDirection: 'column',
                            paddingLeft: 5,
                            paddingBottom: 5,
                        }}
                    >
                        <View>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_MEDIUM,
                                    paddingTop: 15,
                                }}
                            >
                                Achievement
                            </Text>
                        </View>

                        <View>
                            <View style={{}}>
                                {challengeSummary.challengeRewards &&
                                    challengeSummary.challengeRewards.length > 0 && (
                                        <ChallengeRewardView
                                            reward={challengeSummary.challengeRewards[0]}
                                        />
                                    )}
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingTop: 7.5, paddingHorizontal: 5, paddingBottom: 15 }}>
                        <View
                            style={[
                                {
                                    borderRadius: 5,
                                    borderColor: colors.toggle_background_unselected,
                                    flexDirection: 'row',
                                    padding: 7.5,
                                    backgroundColor: colors.text_input_background_secondary,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                },
                                CARD_SHADOW,
                            ]}
                        >
                            <TouchableOpacity
                                onPress={registerForChallenge}
                                disabled={userIsAParticipant}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Text
                                        style={{
                                            fontFamily: POPPINS_MEDIUM,
                                            color: colors.accent_color_light,
                                            fontSize: 12,
                                        }}
                                    >
                                        {userIsAParticipant
                                            ? 'Challenge Accepted  ✅'
                                            : 'Join Challenge'}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ paddingHorizontal: PADDING_SMALL }}>
                        <PostDetailsActionBar
                            interactableData={interactableData}
                            isCurrentUser={false}
                        />
                    </View>
                </View>
            </View>
        </Pressable>
    );
};
