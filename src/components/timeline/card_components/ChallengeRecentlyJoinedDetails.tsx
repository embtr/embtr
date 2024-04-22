import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChallengeReward } from 'resources/schema';
import { ChallengeBadge } from 'src/components/challenge/ChallengeBadge';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { TimelineController } from 'src/controller/timeline/TimelineController';
import { CARD_SHADOW, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';

interface Props {
    challengeId: number;
    isAParticipant: boolean;
    challengeReward: ChallengeReward;
}

export const ChallengeRecentlyJoinedDetails = ({
    challengeId,
    isAParticipant,
    challengeReward,
}: Props) => {
    const { colors } = useTheme();

    const registerForChallenge = async () => {
        if (!challengeId) {
            return;
        }

        const currentUserId = await getUserIdFromToken();
        if (!currentUserId) {
            return;
        }

        await ChallengeController.register(challengeId);
    };

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
            </View>
            <View>
                <View style={{ paddingTop: 12 }}>
                    <TouchableOpacity onPress={registerForChallenge} disabled={isAParticipant}>
                        <View
                            style={[
                                {
                                    backgroundColor: isAParticipant
                                        ? colors.accent_color_light
                                        : colors.accent_color,
                                    borderRadius: 5,
                                    paddingVertical: 6,
                                    opacity: isAParticipant ? 0.5 : 1,
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
                                {isAParticipant ? 'Challenge Accepted!' : 'Join Challenge'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
