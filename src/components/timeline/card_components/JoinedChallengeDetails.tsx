import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RecentlyJoinedChallenge } from 'resources/types/dto/RecentlyJoinedChallenge';
import { ChallengeBadge } from 'src/components/challenge/ChallengeBadge';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    recentlyJoinedChallenge: RecentlyJoinedChallenge;
}

export const JoinedChallengeDetails = ({ recentlyJoinedChallenge }: Props) => {
    const { colors } = useTheme();
    const [userIsAParticipant, setUserIsAParticipant] = React.useState(recentlyJoinedChallenge.isParticipant);

    if (!recentlyJoinedChallenge.challenge.challenge.challengeRewards?.length) {
        return <View />;
    }


    const challengeReward = recentlyJoinedChallenge.challenge.challenge.challengeRewards[0];

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
                            ChallengeController.register(recentlyJoinedChallenge.challenge.challenge.id ?? 0);
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
