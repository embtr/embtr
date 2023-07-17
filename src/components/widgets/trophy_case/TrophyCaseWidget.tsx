import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { WidgetBase } from '../WidgetBase';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { Challenge, ChallengeParticipant, User } from 'resources/schema';
import { SvgUri } from 'react-native-svg';
import { TrophyDetailsModal } from 'src/components/trophy_case/TrophyDetailsModal';

interface Props {
    user: User;
}
export const TrophyCaseWidget = ({ user }: Props) => {
    const { colors } = useTheme();

    const [completedChallengeParticipation, setCompletedChallengeParticipation] = React.useState<
        ChallengeParticipant[]
    >([]);
    const [selectedChallengeParticipant, setSelectedChallengeParticipant] =
        React.useState<ChallengeParticipant>();

    React.useEffect(() => {
        const fetch = async () => {
            if (!user.id) {
                return;
            }

            const challengeParticipation = await ChallengeController.getAllCompletedForUser(
                user.id
            );
            if (!challengeParticipation) {
                return;
            }

            setCompletedChallengeParticipation(challengeParticipation);
        };

        fetch();
    }, []);

    const trophyElements: JSX.Element[] = [];
    for (let i = 0; i < completedChallengeParticipation.length; i++) {
        const url = completedChallengeParticipation[i].challenge?.challengeRewards?.[0].imageUrl;
        trophyElements.push(
            <View style={{ paddingHorizontal: 10 }}>
                <Pressable
                    onPress={() => {
                        setSelectedChallengeParticipant(completedChallengeParticipation[i]);
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
                challengeParticipant={selectedChallengeParticipant}
                visible={selectedChallengeParticipant !== undefined}
                onDismiss={() => {
                    setSelectedChallengeParticipant(undefined);
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
