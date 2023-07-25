import { View, Text, TouchableOpacity } from 'react-native';
import { ChallengeRewardView } from 'src/components/challenge/ChallengeRewardView';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { Challenge, ChallengeParticipant } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import React from 'react';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { formatUtcDate } from 'src/util/DateUtility';

interface Props {
    challenge: Challenge;
}

export const ChallengeBody = ({ challenge }: Props) => {
    const { colors } = useTheme();

    const [userIsAParticipant, setUserIsAParticipant] = React.useState(false);
    const [participantCount, setParticipantCount] = React.useState(
        challenge.challengeParticipants?.length || 0
    );

    const startDate: Date = challenge.start ?? new Date();
    const endDate: Date = challenge.end ?? new Date();
    const formattedStartDate = formatUtcDate(startDate);
    const formattedEndDate = formatUtcDate(endDate);

    const daysUntilStart = Math.floor((startDate.getTime() - new Date().getTime()) / 86400000);

    React.useEffect(() => {
        const fetch = async () => {
            const currentUserId = await getUserIdFromToken();

            const userIsAParticipant = challenge?.challengeParticipants?.some(
                (participant: ChallengeParticipant) => participant.userId === currentUserId
            );

            setUserIsAParticipant(userIsAParticipant || false);
        };

        fetch();
    }, []);

    const registerForChallenge = async () => {
        if (!challenge.id) {
            return;
        }

        ChallengeController.register(challenge.id);
        setUserIsAParticipant(true);
        setParticipantCount(participantCount + 1);
    };

    return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <View>
                        <Text
                            numberOfLines={1}
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 16,
                            }}
                        >
                            {challenge.name}
                        </Text>
                    </View>

                    <Text
                        style={{
                            paddingTop: 2,
                            fontFamily: POPPINS_REGULAR,
                            color: colors.secondary_text,
                            fontSize: 12,
                            bottom: isAndroidDevice() ? 5 : 3,
                        }}
                    >
                        {participantCount} participant{participantCount === 1 ? '' : 's'} •
                        {daysUntilStart > 0 ? (
                            <Text
                                style={{
                                    paddingTop: 2,
                                    fontFamily: POPPINS_REGULAR,
                                    color: colors.tab_selected,
                                    fontSize: 12,
                                    bottom: isAndroidDevice() ? 5 : 3,
                                }}
                            >
                                {' '}
                                starts in {daysUntilStart} days
                            </Text>
                        ) : (
                            <Text
                                style={{
                                    paddingTop: 2,
                                    fontFamily: POPPINS_REGULAR,
                                    color: colors.tab_selected,
                                    fontSize: 12,
                                    bottom: isAndroidDevice() ? 5 : 3,
                                }}
                            >
                                {' in progress'}
                            </Text>
                        )}
                    </Text>

                    <Text
                        numberOfLines={2}
                        style={{
                            paddingTop: 5,
                            fontFamily: POPPINS_REGULAR,
                            color: colors.text,
                            fontSize: 13,
                        }}
                    >
                        {challenge.description}
                    </Text>
                </View>
                <View>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 10,
                        }}
                    >
                        {formattedStartDate} - {formattedEndDate}
                    </Text>
                </View>
            </View>

            {/* BOTTOM SECTION */}
            <View
                style={{
                    justifyContent: 'flex-end',
                    alignContent: 'center',
                }}
            >
                {/* Achievement */}
                <View
                    style={{
                        flexDirection: 'column',
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
                        <View>
                            {challenge.challengeRewards &&
                                challenge.challengeRewards.length > 0 && (
                                    <ChallengeRewardView reward={challenge.challengeRewards[0]} />
                                )}
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        paddingTop: 15,
                        paddingBottom: 10,
                    }}
                >
                    <TouchableOpacity onPress={registerForChallenge} disabled={userIsAParticipant}>
                        <View
                            style={{
                                borderWidth: 1,
                                borderRadius: 5,
                                borderColor: colors.toggle_background_unselected,
                                flexDirection: 'row',
                                padding: 7.5,
                                backgroundColor: colors.text_input_background_secondary,
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        fontFamily: POPPINS_MEDIUM,
                                        color: colors.tab_selected,
                                        fontSize: 12,
                                    }}
                                >
                                    {userIsAParticipant
                                        ? 'Challenge Accepted  ✅'
                                        : 'Join Challenge'}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
