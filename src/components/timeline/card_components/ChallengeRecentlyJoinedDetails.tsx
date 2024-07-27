import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChallengeBadge } from 'src/components/challenge/ChallengeBadge';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { CARD_SHADOW, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import * as StoreReview from 'expo-store-review';
import { Award } from 'resources/types/dto/Challenge';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';

interface Props {
    challengeId: number;
    isAParticipant: boolean;
    award: Award;
    canJoin: boolean;
}

export const ChallengeRecentlyJoinedDetails = ({
    challengeId,
    isAParticipant,
    award,
    canJoin,
}: Props) => {
    const { colors } = useTheme();

    const optimalImage: OptimalImageData = {
        remoteImageUrl: award.remoteImageUrl,
        localImage: award.localImage,
    };

    const registerForChallenge = async () => {
        if (!challengeId) {
            return;
        }

        const currentUserId = await getUserIdFromToken();
        if (!currentUserId) {
            return;
        }

        await ChallengeController.register(challengeId);

        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
            StoreReview.requestReview();
        }
    };

    const disableButton = isAParticipant || !canJoin;
    const buttonText = isAParticipant
        ? 'Challenge Accepted!'
        : canJoin
            ? 'Join Challenge'
            : 'Can no longer join';

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
                            <ChallengeBadge optimalImage={optimalImage} size={30} />
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
                            {award.name}
                        </Text>
                    </View>
                </View>
            </View>
            <View>
                <View style={{ paddingTop: 12 }}>
                    <TouchableOpacity onPress={registerForChallenge} disabled={disableButton}>
                        <View
                            style={[
                                {
                                    backgroundColor: disableButton
                                        ? colors.accent_color_light
                                        : colors.accent_color,
                                    borderRadius: 5,
                                    paddingVertical: 6,
                                    opacity: disableButton ? 0.5 : 1,
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
                                {buttonText}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
