import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeParticipant, JoinedChallenge } from 'resources/schema';
import { HorizontalLine } from '../../HorizontalLine';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { ChallengeBody } from './ChallengeBody';
import PostDetailsActionBar from '../../comments/PostDetailsActionBar';
import React from 'react';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';

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

    const [likeCount, setLikeCount] = React.useState(challenge.likes?.length || 0);
    const [isLiked, setIsLiked] = React.useState(false);

    React.useEffect(() => {
        const fetch = async () => {
            const currentUserId = await getUserIdFromToken();

            const userHasLiked = challenge?.likes?.some(
                (like: ChallengeParticipant) => like.userId === currentUserId
            );

            setIsLiked(userHasLiked || false);
        };

        fetch();
    }, []);

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
                    {firstChallengeParticipant?.user && (
                        <NavigatableUserImage user={firstChallengeParticipant.user} size={32} />
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
                <View style={{ paddingHorizontal: 7.5 }}>
                    <View style={{ height: TIMELINE_CARD_PADDING }} />
                    <HorizontalLine />
                    <View style={{ height: 5 }} />
                    <ChallengeBody challenge={challenge} />
                </View>

                <PostDetailsActionBar
                    likeCount={likeCount}
                    isLiked={isLiked}
                    commentCount={challenge.comments?.length ?? 0}
                    onLike={likeChallenge}
                />
            </View>
        </Pressable>
    );
};

/*

*/
