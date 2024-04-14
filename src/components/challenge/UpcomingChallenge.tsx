import React from 'react';
import {
    CARD_SHADOW,
    PADDING_LARGE,
    PADDING_SMALL,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';
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
import { HorizontalLine } from '../common/HorizontalLine';

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
                    borderRadius: 9,
                    padding: PADDING_LARGE,
                }}
            >
                {/* TOP SECTION */}
                <View>
                    {/* HEADER */}
                    <View>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 16,
                            }}
                        >
                            {challengeSummary.name}
                        </Text>

                        <View>
                            <Text
                                style={{
                                    fontFamily: POPPINS_REGULAR,
                                    color: colors.secondary_text,
                                    fontSize: 12,
                                    bottom: 4,
                                }}
                            >
                                {participantCount} participant{participantCount === 1 ? '' : 's'} •{' '}
                                <Text
                                    style={{
                                        fontFamily: POPPINS_REGULAR,
                                        color: colors.accent_color_light,
                                    }}
                                >
                                    {ChallengeUtility.getDaysRemainingText(
                                        daysUntilStart,
                                        daysRemaining
                                    )}
                                </Text>{' '}
                                • {totalDays}
                                {' day challenge'}
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontFamily: POPPINS_REGULAR,
                                color: colors.text,
                                fontSize: 11,
                                paddingVertical: PADDING_LARGE,
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
                        alignContent: 'center',
                    }}
                >
                    {/* Achievement */}
                    <View>
                        <View>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_MEDIUM,
                                }}
                            >
                                Achievement
                            </Text>
                        </View>

                        <View>
                            {challengeSummary.challengeRewards &&
                                challengeSummary.challengeRewards.length > 0 && (
                                    <ChallengeRewardView
                                        reward={challengeSummary.challengeRewards[0]}
                                    />
                                )}
                        </View>
                    </View>
                    <View style={{ paddingVertical: PADDING_LARGE }}>
                        <TouchableOpacity
                            onPress={registerForChallenge}
                            disabled={userIsAParticipant}
                        >
                            <View
                                style={[
                                    {
                                        backgroundColor: userIsAParticipant
                                            ? colors.accent_color_light
                                            : colors.accent_color,
                                        borderRadius: 5,
                                        paddingVertical: 6,
                                        opacity: userIsAParticipant ? 0.5 : 1,
                                    },
                                    CARD_SHADOW,
                                ]}
                            >
                                <Text
                                    style={{
                                        textAlign: 'center',
                                        fontFamily: POPPINS_SEMI_BOLD,
                                        fontSize: 11,
                                        color: colors.text,
                                    }}
                                >
                                    {userIsAParticipant ? 'Challenge Accepted!' : 'Join Challenge'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <HorizontalLine />
                    <View style={{ paddingVertical: PADDING_SMALL }} />
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
