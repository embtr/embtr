import { POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { shouldUseNarrowView } from 'src/util/GeneralUtility';
import { UpcomingChallengeActionable } from 'src/components/challenge/UpcomingChallengeActionable';
import { ChallengeBadge } from 'src/components/challenge/ChallengeBadge';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { Challenge } from 'resources/schema';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';

interface Props {
    challenge: Challenge;
}

export const UpcomingChallenge = ({ challenge }: Props) => {
    const { colors } = useTheme();
    const useNarrowView = shouldUseNarrowView();

    const daysRemaining = Math.floor(
        (challenge.start!.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );

    const registerForChallenge = async () => {
        if (!challenge.id) {
            return;
        }

        ChallengeController.register(challenge.id);
    };

    return (
        <View
            style={{
                width: '100%',
                backgroundColor: colors.text_input_background,
                borderRadius: 5,
            }}
        >
            {/* TOP SECTION */}
            <View style={{ padding: 10 }}>
                {/* HEADER */}
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                flex: 1,
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 18,
                            }}
                        >
                            {challenge.name}
                        </Text>
                        <Text
                            style={{
                                bottom: 5,
                                color: colors.secondary_text,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 11,
                            }}
                        >
                            {daysRemaining} days away
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontFamily: POPPINS_REGULAR,
                            color: colors.secondary_text,
                            paddingTop: 10,
                        }}
                    >
                        {challenge.description}
                    </Text>
                </View>

                {/* Achievement */}
                <View style={{ flexDirection: useNarrowView ? 'column' : 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                paddingTop: 15,
                            }}
                        >
                            Hosted By
                        </Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 5 }}>
                            {challenge.creator && (
                                <NavigatableUserImage
                                    user={challenge.creator!}
                                    size={useNarrowView ? 30 : 45}
                                />
                            )}
                            <Text
                                style={{
                                    paddingLeft: 5,
                                    fontFamily: POPPINS_REGULAR,
                                    color: colors.text,
                                    fontSize: useNarrowView ? 13 : 17,
                                }}
                            >
                                {challenge.creator?.displayName}
                            </Text>
                        </View>
                    </View>

                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                                paddingTop: 15,
                            }}
                        >
                            Achievement
                        </Text>

                        <View style={{ paddingTop: 5 }}>
                            <ChallengeBadge />
                        </View>
                    </View>
                </View>
            </View>

            {/* BOTTOM SECTION */}
            <View style={{ flexDirection: 'row', flex: 1, paddingTop: 10 }}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'row',
                    }}
                >
                    <UpcomingChallengeActionable
                        icon={'people-outline'}
                        count={challenge.challengeParticipants?.length ?? 0}
                    />
                    <UpcomingChallengeActionable icon={'heart-outline'} count={4} />
                    <UpcomingChallengeActionable icon={'chatbox-outline'} count={6} />
                </View>

                <View
                    style={{
                        alignItems: 'flex-end',
                        justifyContent: 'flex-end',
                        paddingRight: 10,
                        paddingLeft: useNarrowView ? 10 : 0,
                        paddingBottom: 10,
                        paddingTop: 5,
                        flexDirection: 'row',
                        flex: useNarrowView ? undefined : 1,
                    }}
                >
                    {!useNarrowView && (
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'flex-end',
                                paddingRight: 20,
                                bottom: 2,
                            }}
                        >
                            <Ionicons
                                name={'share-outline'}
                                size={30}
                                color={colors.secondary_text}
                            />
                        </View>
                    )}

                    <TouchableOpacity
                        onPress={() => {
                            registerForChallenge();
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: colors.text_input_background_secondary,
                                padding: 10,
                                borderRadius: 5,
                            }}
                        >
                            <Text
                                style={{ color: colors.text, fontFamily: POPPINS_REGULAR, top: 2 }}
                            >
                                Join Challenge
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
