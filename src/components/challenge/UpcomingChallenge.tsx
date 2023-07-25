import React from 'react';
import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Challenge, ChallengeParticipant } from 'resources/schema';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { ChallengeRewardView } from './ChallengeRewardView';

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

    const daysUntilStart = Math.floor(
        ((challenge.start ?? new Date()).getTime() - new Date().getTime()) / 86400000
    );

    const daysRemaining = Math.floor(
        ((challenge.end ?? new Date()).getTime() - new Date().getTime()) / 86400000
    );

    const totalDays = Math.floor(
        ((challenge.end ?? new Date()).getTime() - (challenge.start ?? new Date()).getTime()) /
            86400000
    );

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

    return (
        <View
            style={{
                backgroundColor: colors.text_input_background,
                width: '100%',
                height: 280,
                borderRadius: 2.5,
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
                        {challenge.name}
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
                            {daysUntilStart > 0 ? (
                                <Text
                                    style={{
                                        paddingTop: 2,
                                        fontFamily: POPPINS_REGULAR,
                                        color: colors.tab_selected,
                                        fontSize: 8,
                                    }}
                                >
                                    starts in {daysUntilStart} days
                                </Text>
                            ) : (
                                <Text
                                    style={{
                                        paddingTop: 2,
                                        fontFamily: POPPINS_REGULAR,
                                        color: colors.tab_selected,
                                        fontSize: 8,
                                    }}
                                >
                                    {daysRemaining} {'day'}
                                    {daysRemaining === 1 ? '' : 's'} left
                                </Text>
                            )}{' '}
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
                                    <ChallengeRewardView reward={challenge.challengeRewards[0]} />
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

                <PostDetailsActionBar
                    likeCount={likeCount}
                    isLiked={isLiked}
                    commentCount={challenge.comments?.length ?? 0}
                    onLike={likeChallenge}
                />
            </View>
        </View>
    );
};
