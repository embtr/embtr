import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_SEMI_BOLD } from 'src/util/constants';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';
import { CardHeader } from './card_components/CardHeader';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { InteractableData } from 'src/components/timeline/interactable/InteractableElementCustomHooks';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { RecentlyJoinedChallenge } from 'resources/types/dto/RecentlyJoinedChallenge';
import { JoinedChallengeDetails } from './card_components/JoinedChallengeDetails';

interface Props {
    recentlyJoinedChallenge: RecentlyJoinedChallenge,
    interactableData: InteractableData;
}

export const RecentlyJoinedChallengeElement = ({ recentlyJoinedChallenge, interactableData }: Props) => {
    const { colors } = useTheme();

    const user = recentlyJoinedChallenge.latestParticipant.user;
    if (!user) {
        return <View />;
    }

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
                date={recentlyJoinedChallenge.latestParticipant.createdAt ?? new Date()}
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
                    {recentlyJoinedChallenge.challenge.challenge.name}
                </Text>
            </View>

            {/****************************/}
            {/* JOINED CHALLENGE DETAILS */}
            {/****************************/}
            <View style={{ paddingTop: PADDING_LARGE }}>
                <JoinedChallengeDetails recentlyJoinedChallenge={recentlyJoinedChallenge} />
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
