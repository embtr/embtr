import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    CARD_SHADOW,
    PADDING_LARGE,
    PADDING_SMALL,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';
import { InteractableData } from 'src/components/timeline/interactable/InteractableElementCustomHooks';
import { ChallengeDetails } from 'resources/types/dto/Challenge';
import { ChallengeRecentlyJoinedDetails } from 'src/components/timeline/card_components/ChallengeRecentlyJoinedDetails';
import PostDetailsActionBar from '../../comments/PostDetailsActionBar';

interface Props {
    challengeDetails: ChallengeDetails;
    interactableData: InteractableData;
}

export const ChallengeDetailsBody = ({ challengeDetails, interactableData }: Props) => {
    const { colors } = useTheme();

    return (
        <View
            style={[
                {
                    backgroundColor: colors.card_background,
                    borderRadius: 9,
                    paddingHorizontal: 12,
                    paddingVertical: PADDING_SMALL,
                },
                CARD_SHADOW,
            ]}
        >
            {/**********/}
            {/* TITLE */}
            {/**********/}
            <View>
                <Text
                    style={{
                        fontFamily: POPPINS_SEMI_BOLD,
                        fontSize: 14,
                        color: colors.text,
                    }}
                >
                    {challengeDetails.name}
                </Text>
            </View>

            {/**********/}
            {/*  BODY  */}
            {/**********/}
            <View style={{ paddingTop: PADDING_SMALL }}>
                <Text
                    style={{
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 13,
                        color: colors.text,
                    }}
                >
                    {challengeDetails.description}
                </Text>
            </View>

            {/****************************/}
            {/* JOINED CHALLENGE DETAILS */}
            {/****************************/}
            <View style={{ paddingTop: PADDING_LARGE }}>
                <ChallengeRecentlyJoinedDetails
                    isAParticipant={challengeDetails.isParticipant}
                    challengeId={challengeDetails.id}
                    award={challengeDetails.award}
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
                        isCurrentUser={false}
                    />
                </View>
            </View>
        </View>
    );
};
