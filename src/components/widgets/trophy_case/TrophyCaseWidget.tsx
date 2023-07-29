import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { WidgetBase } from '../WidgetBase';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { ChallengeParticipant } from 'resources/schema';
import { SvgUri } from 'react-native-svg';
import { TrophyDetailsModal } from 'src/components/trophy_case/TrophyDetailsModal';

interface Props {
    completedChallenges: ChallengeParticipant[];
}
export const TrophyCaseWidget = ({ completedChallenges }: Props) => {
    const { colors } = useTheme();
    const [selectedChallenge, setSelectedChallenge] = React.useState<ChallengeParticipant>();

    const trophyElements: JSX.Element[] = [];
    for (let i = 0; i < completedChallenges.length; i++) {
        const url = completedChallenges[i].challenge?.challengeRewards?.[0].imageUrl;
        trophyElements.push(
            <View style={{ paddingHorizontal: 10 }}>
                <Pressable
                    onPress={() => {
                        setSelectedChallenge(completedChallenges[i]);
                    }}
                >
                    <SvgUri width={50} height={50} uri={url ?? ''} />
                </Pressable>
            </View>
        );
    }

    return (
        <WidgetBase>
            <TrophyDetailsModal
                challengeParticipant={selectedChallenge}
                visible={selectedChallenge !== undefined}
                onDismiss={() => {
                    setSelectedChallenge(undefined);
                }}
            />
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                Trophy Case
            </Text>
            <View style={{ paddingTop: 10 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {trophyElements}
                </ScrollView>
            </View>
        </WidgetBase>
    );
};
