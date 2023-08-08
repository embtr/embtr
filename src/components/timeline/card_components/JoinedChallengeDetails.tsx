import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { JoinedChallenge } from 'resources/schema';
import { ChallengeBadge } from 'src/components/challenge/ChallengeBadge';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    joinedChallenge: JoinedChallenge;
}

export const JoinedChallengeDetails = ({ joinedChallenge }: Props) => {
    if (!joinedChallenge.challenge.challengeRewards?.length) {
        return <View />;
    }

    const currentUser = useAppSelector(getCurrentUser);
    const { colors } = useTheme();

    const [userIsAParticipant, setUserIsAParticipant] = React.useState(
        joinedChallenge.challenge.challengeParticipants?.some(
            (participant) => participant.userId === currentUser.id
        )
    );

    const challengeReward = joinedChallenge.challenge.challengeRewards[0];

    return (
        <View
            style={{
                backgroundColor: '#343434',
                borderRadius: 5,
                paddingHorizontal: 12,
                paddingVertical: 8,
            }}
        >
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ paddingRight: 8 }}>
                            <ChallengeBadge reward={challengeReward} size={30} />
                        </View>

                        <Text
                            style={{
                                includeFontPadding: false,
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 12,
                                color: colors.text,
                                textAlign: 'center',
                            }}
                        >
                            {challengeReward.name}
                        </Text>
                    </View>
                </View>

                <View
                    style={{
                        backgroundColor: '#515151',
                        paddingVertical: 8,
                        paddingHorizontal: 12,
                        borderRadius: 10,
                    }}
                >
                    <Text
                        style={{
                            includeFontPadding: false,
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 12,
                            color: colors.text,
                            textAlign: 'center',
                        }}
                    >
                        +50 XP
                    </Text>
                </View>
            </View>
            <View>
                <View style={{ paddingTop: 12 }}>
                    <TouchableOpacity
                        onPress={() => {
                            ChallengeController.register(joinedChallenge.challenge.id ?? 0);
                            setUserIsAParticipant(true);
                            //setParticipantCount(participantCount + 1);
                        }}
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
                                {userIsAParticipant ? 'Joined!' : 'Join Challenge'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
