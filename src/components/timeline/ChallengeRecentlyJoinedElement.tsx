import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';
import { CardHeader } from './card_components/CardHeader';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { InteractableData } from 'src/components/timeline/interactable/InteractableElementCustomHooks';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { ChallengeRecentlyJoined } from 'resources/types/dto/Challenge';
import { ChallengeRecentlyJoinedDetails } from './card_components/ChallengeRecentlyJoinedDetails';

interface Props {
    challengeRecentlyJoined: ChallengeRecentlyJoined;
    interactableData: InteractableData;
}

export const ChallengeRecentlyJoinedElement = ({
    challengeRecentlyJoined: challengeRecentlyJoined,
    interactableData,
}: Props) => {
    const { colors } = useTheme();

    const user = challengeRecentlyJoined.latestParticipant.user;
    if (!user) {
        return <View />;
    }

    const body =
        challengeRecentlyJoined.participantCount > 2
            ? `${user?.displayName}, and ${challengeRecentlyJoined.participantCount} others have joined the challenge!`
            : challengeRecentlyJoined.participantCount === 2
                ? `${user?.displayName}, and one other have joined the challenge!`
                : `${user?.displayName} has joined the challenge!`;

    const secondaryHeader = user.location ?? '';
    const isCurrentUser = getCurrentUid() === user.uid;

    return (
        <View
            style={[
                {
                    backgroundColor: colors.card_background,
                    borderRadius: 9,
                    padding: 12,
                },
                CARD_SHADOW,
            ]}
        >
            {/**********/}
            {/* HEADER */}
            {/**********/}
            <CardHeader
                date={challengeRecentlyJoined.latestParticipant.createdAt ?? new Date()}
                user={user}
                secondaryText={secondaryHeader}
                type={TimelineElementType.RECENTLY_JOINED_CHALLENGE}
            />

            {/**********/}
            {/* TITLE */}
            {/**********/}
            <View style={{ paddingTop: PADDING_LARGE }}>
                <Text
                    style={{
                        fontFamily: POPPINS_SEMI_BOLD,
                        fontSize: 14,
                        color: colors.text,
                    }}
                >
                    {challengeRecentlyJoined.name}
                </Text>
            </View>

            {/**********/}
            {/*  BODY  */}
            {/**********/}
            <View style={{ paddingTop: 12 }}>
                <Text
                    style={{
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 13,
                        color: colors.text,
                    }}
                >
                    {body}
                </Text>
            </View>

            {/****************************/}
            {/* JOINED CHALLENGE DETAILS */}
            {/****************************/}
            <View style={{ paddingTop: PADDING_LARGE }}>
                <ChallengeRecentlyJoinedDetails
                    challengeId={challengeRecentlyJoined.id}
                    isAParticipant={challengeRecentlyJoined.isParticipant}
                    challengeReward={challengeRecentlyJoined.challengeRewards[0]}
                />
            </View>

            {/********************/}
            {/*    ACTION BAR    */}
            {/********************/}
            <View style={{ paddingTop: PADDING_LARGE }}>
                <View
                    style={{
                        borderColor: colors.secondary_text,
                        borderTopWidth: StyleSheet.hairlineWidth,
                    }}
                >
                    <View style={{ height: 8 }} />
                    <PostDetailsActionBar
                        interactableData={interactableData}
                        isCurrentUser={isCurrentUser}
                    />
                </View>
            </View>
        </View>
    );
};
