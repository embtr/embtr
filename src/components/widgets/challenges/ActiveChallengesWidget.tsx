import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import {
    PADDING_LARGE,
    PADDING_SMALL,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';
import { ActiveChallengeElement } from './ActiveChallengeElement';
import { ChallengeCustomHooks } from 'src/controller/challenge/ChallengeController';

interface Props {
    userId: number;
}

export const ActiveChallengesWidget = ({ userId }: Props) => {
    const { colors } = useTheme();

    const activeParticipation = ChallengeCustomHooks.useActiveParticipation(userId);

    if (!activeParticipation.data || activeParticipation.data.length === 0) {
        return <View />;
    }

    return (
        <View style={{ paddingTop: PADDING_LARGE }}>
            <WidgetBase>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 15,
                                lineHeight: 17,
                                bottom: 2,
                            }}
                        >
                            Active Challenges
                        </Text>
                    </View>

                    <View>
                        <Text
                            style={{
                                color: colors.accent_color_light,
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 12,
                                lineHeight: 14,
                                bottom: 2,
                            }}
                        >
                            {activeParticipation.data?.length ?? 0} Active
                        </Text>
                    </View>
                </View>

                <View style={{ height: PADDING_SMALL }} />

                {activeParticipation.data?.map((challengeParticipant) => (
                    <View key={challengeParticipant.id} style={{ paddingRight: 7.5 }}>
                        <ActiveChallengeElement challengeParticipant={challengeParticipant} />
                    </View>
                ))}

                <View style={{ height: PADDING_SMALL / 2 }} />
            </WidgetBase>
        </View>
    );
};
