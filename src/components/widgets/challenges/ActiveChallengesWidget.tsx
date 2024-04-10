import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';
import React from 'react';
import { ActiveChallengeElement } from './ActiveChallengeElement';
import { ScrollView } from 'react-native-gesture-handler';
import { ChallengeCustomHooks } from 'src/controller/challenge/ChallengeController';

interface Props {
    userId: number;
}

export const ActiveChallengesWidget = ({ userId }: Props) => {
    const { colors } = useTheme();

    const activeParticipation = ChallengeCustomHooks.useActiveParticipation(userId);

    return (
        <WidgetBase>
            <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                    <Text
                        style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}
                    >
                        Active Challenges
                    </Text>
                </View>

                <View style={{ paddingTop: 10 }}>
                    <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, fontSize: 12 }}>
                        {activeParticipation.data?.length ?? 0} Active
                    </Text>
                </View>
            </View>

            <ScrollView
                style={{ paddingTop: 5, paddingBottom: 3 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {activeParticipation.data?.map((challengeParticipant) => (
                    <View key={challengeParticipant.id} style={{ paddingRight: 7.5 }}>
                        <ActiveChallengeElement challengeParticipant={challengeParticipant} />
                    </View>
                ))}
            </ScrollView>
        </WidgetBase>
    );
};
