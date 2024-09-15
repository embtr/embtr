import React from 'react';
import {
    CARD_SHADOW,
    PADDING_LARGE,
    PADDING_MEDIUM,
    PADDING_SMALL,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';
import { ChallengeUtility } from 'src/util/challenge/ChallengeUtility';
import { ChallengeSummary } from 'resources/types/dto/Challenge';
import { ChallengeSummaryInteractableElementCustomHooks } from '../timeline/interactable/ChallengeSummaryInteractableElementCustomHooks';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { HorizontalLine } from '../common/HorizontalLine';
import { ChallengeAward } from './ChallengeAward';
import * as StoreReview from 'expo-store-review';

interface Props {
    challengeSummary: ChallengeSummary;
}

export const UpcomingChallenge = ({ challengeSummary }: Props) => {
    const { colors } = useTheme();
    const navigation = useEmbtrNavigation();

    const interactableData =
        ChallengeSummaryInteractableElementCustomHooks.useInteractableElement(challengeSummary);

    let tagName = challengeSummary.tag.name ?? '';
    tagName = tagName.charAt(0).toUpperCase() + tagName.slice(1).toLowerCase();

    const participantCount = challengeSummary.participantCount ?? 0;
    const userIsAParticipant = challengeSummary.isParticipant;
    const disableButton = userIsAParticipant || !challengeSummary.canJoin;
    const buttonText = userIsAParticipant
        ? 'Challenge Accepted!'
        : challengeSummary.canJoin
            ? 'Join Challenge'
            : 'Can no longer join';

    const daysUntilStart = Math.ceil(
        ((new Date(challengeSummary.start) ?? new Date()).getTime() - new Date().getTime()) /
        86400000
    );

    const daysRemaining = Math.ceil(
        ((challengeSummary.end ?? new Date()).getTime() - new Date().getTime()) / 86400000
    );

    const totalDays = Math.ceil(
        ((challengeSummary.end ?? new Date()).getTime() -
            (challengeSummary.start ?? new Date()).getTime()) /
        86400000
    );

    const registerForChallenge = async () => {
        const currentUserId = await getUserIdFromToken();
        if (!challengeSummary.id || !currentUserId) {
            return;
        }

        await ChallengeController.register(challengeSummary.id);
        const isAvailable = await StoreReview.isAvailableAsync();
        if (isAvailable) {
            StoreReview.requestReview();
        }
    };

    return (
        <Pressable
            onPress={() => {
                if (!challengeSummary.id) {
                    return;
                }

                ChallengeSummaryInteractableElementCustomHooks.createEventListeners(
                    challengeSummary,
                    interactableData
                );
                navigation.navigate(Routes.CHALLENGE_DETAILS_VIEW, { id: challengeSummary.id });
            }}
            style={{
                ...CARD_SHADOW, // Assuming CARD_SHADOW is the style for card shadow
            }}
        >
            <View
                style={{
                    backgroundColor: colors.card_background,
                    width: '100%',
                    borderRadius: 9,
                    padding: PADDING_LARGE,
                }}
            >
                {/* TOP SECTION */}
                <View>
                    {/* HEADER */}
                    <View style={{ width: '100%' }}>
                        <View
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center', // Ensures proper vertical alignment
                            }}
                        >
                            <Text
                                numberOfLines={1}
                                ellipsizeMode="tail"
                                style={{
                                    flex: 1, // Allows the text to take up available space but not push the tag out
                                    color: colors.text,
                                    fontFamily: POPPINS_MEDIUM,
                                    fontSize: 16,
                                }}
                            >
                                {challengeSummary.name}
                            </Text>

                            <View
                                style={{
                                    marginBottom: PADDING_MEDIUM,
                                    backgroundColor: challengeSummary.tag.color,
                                    paddingHorizontal: 12,
                                    paddingVertical: 2,
                                    borderRadius: 50,
                                    flexShrink: 1, // Ensures the tag container doesn't expand too much
                                    maxWidth: '40%', // Optional: Limit the width of the tag container
                                }}
                            >
                                <Text
                                    numberOfLines={1} // Adds truncation for the tagName if needed
                                    ellipsizeMode="tail"
                                    style={{
                                        includeFontPadding: false,
                                        fontFamily: POPPINS_SEMI_BOLD,
                                        fontSize: 9,
                                        color: colors.text,
                                        textAlign: 'center',
                                    }}
                                >
                                    {tagName}
                                </Text>
                            </View>
                        </View>

                        <View>
                            <Text
                                style={{
                                    fontFamily: POPPINS_REGULAR,
                                    color: colors.secondary_text,
                                    fontSize: 12,
                                    bottom: 4,
                                }}
                            >
                                {participantCount} participant{participantCount === 1 ? '' : 's'} •{' '}
                                <Text
                                    style={{
                                        fontFamily: POPPINS_REGULAR,
                                        color: colors.accent_color_light,
                                    }}
                                >
                                    {ChallengeUtility.getDaysRemainingText(
                                        daysUntilStart,
                                        daysRemaining
                                    )}
                                </Text>{' '}
                                • {totalDays}
                                {' day challenge'}
                            </Text>
                        </View>

                        <Text
                            style={{
                                fontFamily: POPPINS_REGULAR,
                                color: colors.text,
                                fontSize: 11,
                                paddingVertical: PADDING_LARGE,
                            }}
                        >
                            {challengeSummary.description}
                        </Text>
                    </View>
                </View>

                {/* BOTTOM SECTION */}
                <View
                    style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        alignContent: 'center',
                    }}
                >
                    {/* Achievement */}
                    <View>
                        <View>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontFamily: POPPINS_MEDIUM,
                                }}
                            >
                                Achievement
                            </Text>
                        </View>

                        <View>
                            {challengeSummary.award && (
                                <ChallengeAward award={challengeSummary.award} />
                            )}
                        </View>
                    </View>
                    <View style={{ paddingVertical: PADDING_LARGE }}>
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

                    <HorizontalLine />
                    <View style={{ paddingVertical: PADDING_SMALL }} />
                    <View style={{ paddingHorizontal: PADDING_SMALL }}>
                        <PostDetailsActionBar
                            interactableData={interactableData}
                            isCurrentUser={false}
                        />
                    </View>
                </View>
            </View>
        </Pressable>
    );
};
