import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';
import { ChallengeParticipant, User } from 'resources/schema';
import React from 'react';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { ActiveChallengeElement } from './ActiveChallengeElement';
import { ScrollView } from 'react-native-gesture-handler';

interface Props {
    challengeParticipation: ChallengeParticipant[];
}

export const ActiveChallengesWidget = ({ challengeParticipation }: Props) => {
    const { colors } = useTheme();

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
                        {challengeParticipation.length}
                    </Text>
                </View>
            </View>

            <ScrollView
                style={{ paddingTop: 5, paddingBottom: 3 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {challengeParticipation.map((challengeParticipant) => (
                    <View key={challengeParticipant.id} style={{ paddingRight: 7.5 }}>
                        <ActiveChallengeElement challengeParticipant={challengeParticipant} />
                    </View>
                ))}
            </ScrollView>
        </WidgetBase>
    );
};
