import React from 'react';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Challenge, ChallengeParticipant, JoinedChallenge } from 'resources/schema';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { ChallengeRewardView } from 'src/components/challenge/ChallengeRewardView';
import PostDetailsActionBar from '../../comments/PostDetailsActionBar';
import { HorizontalLine } from '../../HorizontalLine';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useNavigation } from '@react-navigation/native';

interface Props {
    joinedChallenge: JoinedChallenge;
}

type navigationProp = StackNavigationProp<TimelineTabScreens, 'ChallengeDetails'>;

export const JoinedChallengeCard = ({ joinedChallenge }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<navigationProp>();

    const challenge = joinedChallenge.challenge;
    const newParticipants = joinedChallenge.participants;
    const firstChallengeParticipant = newParticipants[0];

    const [userIsAParticipant, setUserIsAParticipant] = React.useState(false);
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

            setUserIsAParticipant(userIsAParticipant || false);
            setIsLiked(userHasLiked || false);
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

    const likeChallenge = () => {
        if (!challenge.id) {
            return;
        }

        ChallengeController.like(challenge.id);
        setIsLiked(true);
        setLikeCount(likeCount + 1);
    };

    return (
        <Pressable
            onPress={() => {
                console.log(challenge);
                if (!challenge.id) {
                    return;
                }
                navigation.navigate('ChallengeDetails', { id: challenge.id });
            }}
        >
            <View
                style={{
                    backgroundColor: colors.timeline_card_background,
                    width: '100%',
                    borderRadius: 2.5,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        paddingTop: TIMELINE_CARD_PADDING,
                        paddingLeft: TIMELINE_CARD_PADDING,
                        alignContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    {challenge.challengeParticipants?.[0]?.user && (
                        <NavigatableUserImage
                            user={challenge.challengeParticipants[0].user}
                            size={32}
                        />
                    )}
                    {newParticipants.length === 1 && (
                        <Text style={{ color: colors.text, paddingLeft: 5 }}>
                            {firstChallengeParticipant?.user?.displayName} has joined a challenge
                        </Text>
                    )}

                    {newParticipants.length === 2 && (
                        <Text style={{ color: colors.text, paddingLeft: 5 }}>
                            {firstChallengeParticipant?.user?.displayName} and 1 other have joined a
                            challenge
                        </Text>
                    )}

                    {newParticipants.length > 2 && (
                        <Text style={{ color: colors.text, paddingLeft: 5 }}>
                            {firstChallengeParticipant?.user?.displayName} and{' '}
                            {newParticipants.length - 1} others have joined a challenge
                        </Text>
                    )}
                </View>
                {/* TOP SECTION */}
                <View style={{ padding: 10 }}>
                    <HorizontalLine />
                    <View style={{ height: TIMELINE_CARD_PADDING }} />
                    <View>
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
                            {participantCount} participant{participantCount === 1 ? '' : 's'}
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
                                        <ChallengeRewardView
                                            reward={challenge.challengeRewards[0]}
                                        />
                                    )}
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingTop: 7.5, paddingHorizontal: 5, paddingBottom: 15 }}>
                        <TouchableOpacity
                            onPress={registerForChallenge}
                            disabled={userIsAParticipant}
                        >
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
        </Pressable>
    );
};
