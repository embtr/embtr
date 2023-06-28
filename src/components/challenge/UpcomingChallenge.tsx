import React from 'react';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeBadge } from 'src/components/challenge/ChallengeBadge';
import { Challenge, ChallengeParticipant } from 'resources/schema';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';

interface Props {
    challenge: Challenge;
}

export const UpcomingChallenge = ({ challenge }: Props) => {
    const { colors } = useTheme();

    const [userIsAParticipant, setUsetIsAParticipant] = React.useState(false);
    const [participantCount, setParticipantCount] = React.useState(
        challenge.challengeParticipants?.length || 0
    );
    const [likeCount, setLikeCount] = React.useState(challenge.likes?.length || 0);
    const [isLiked, setIsLiked] = React.useState(false);

    React.useEffect(() => {
        const fetch = async () => {
            const currentUserId = await getUserIdFromToken();

            const userIsAParticipant = challenge?.challengeParticipants?.some(
                (participant: ChallengeParticipant) => participant.userId === currentUserId
            );

            const userHasLiked = challenge?.likes?.some(
                (like: ChallengeParticipant) => like.userId === currentUserId
            );

            setUsetIsAParticipant(userIsAParticipant || false);
            setIsLiked(userHasLiked || false);
        };

        fetch();
    }, []);

    const daysRemaining = Math.floor(
        (challenge.start!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    const registerForChallenge = async () => {
        if (!challenge.id) {
            return;
        }

        ChallengeController.register(challenge.id);
        setUsetIsAParticipant(true);
        setParticipantCount(participantCount + 1);
    };

    const likeChallenge = () => {
        if (!challenge.id) {
            return;
        }

        ChallengeController.like(challenge.id);
        setIsLiked(true);
        setLikeCount(likeCount + 1);
    };

    const percentComplete = challenge.challengeRequirements?.reduce(
        (acc, requirement) => acc + requirement.custom.percentComplete,
        0
    );

    return (
        <View
            style={{
                backgroundColor: colors.text_input_background,
                width: '100%',
                height: 280,
                borderRadius: 5,
            }}
        >
            {/* TOP SECTION */}
            <View style={{ padding: 10 }}>
                {/* HEADER */}
                <View>
                    <View>
                        <Text
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 15,
                            }}
                        >
                            {challenge.name}
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontFamily: POPPINS_REGULAR,
                            color: colors.secondary_text,
                            fontSize: 8,
                            bottom: 5,
                        }}
                    >
                        {participantCount} participant{participantCount === 1 ? '' : 's'} • host
                        {'  '}
                        <Text
                            style={{
                                color: colors.tab_selected,
                                fontFamily: POPPINS_REGULAR,
                                paddingTop: 15,
                                fontSize: 9,
                                textAlign: 'right',
                            }}
                        >
                            {challenge.creator?.displayName}
                        </Text>
                    </Text>

                    <Text
                        style={{
                            fontFamily: POPPINS_REGULAR,
                            color: colors.text,
                            fontSize: 10,
                        }}
                    >
                        {challenge.description}
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
                            {challenge.challengeRewards &&
                                challenge.challengeRewards.length > 0 && (
                                    <ChallengeBadge reward={challenge.challengeRewards[0]} />
                                )}
                        </View>
                    </View>
                </View>
                <View style={{ paddingTop: 7.5, paddingHorizontal: 5, paddingBottom: 15 }}>
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
                        <TouchableOpacity
                            onPress={registerForChallenge}
                            disabled={userIsAParticipant}
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
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ paddingLeft: 5 }}>
                    <PostDetailsActionBar
                        likeCount={likeCount}
                        isLiked={isLiked}
                        commentCount={challenge.comments?.length ?? 0}
                        onLike={likeChallenge}
                    />
                </View>
            </View>
        </View>
    );
};
