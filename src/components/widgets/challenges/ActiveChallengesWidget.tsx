import { Text, ScrollView, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { WidgetBase } from '../WidgetBase';
import { Challenge, User } from 'resources/schema';
import React from 'react';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { ActiveChallengeElement } from './ActiveChallengeElement';

interface Props {
    user: User;
}

export const ActiveChallengesWidget = ({ user }: Props) => {
    const { colors } = useTheme();

    const [challenges, setChallenges] = React.useState<Challenge[]>([]);

    React.useEffect(() => {
        const fetch = async () => {
            if (!user.id) {
                return;
            }

            const challenges = await ChallengeController.getAllForUser(user.id);
            if (!challenges) {
                return;
            }

            setChallenges(challenges);
        };

        fetch();
    }, []);

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

                <View>
                    <Text style={{ color: colors.text, fontFamily: POPPINS_REGULAR, fontSize: 12 }}>
                        {challenges.length}
                    </Text>
                </View>
            </View>

            <ScrollView
                style={{ paddingTop: 5, paddingBottom: 3 }}
                horizontal
                showsHorizontalScrollIndicator={false}
            >
                {challenges.map((challenge) => (
                    <View key={challenge.id} style={{ paddingRight: 7.5 }}>
                        <ActiveChallengeElement challenge={challenge} />
                    </View>
                ))}
            </ScrollView>
        </WidgetBase>
    );
};
