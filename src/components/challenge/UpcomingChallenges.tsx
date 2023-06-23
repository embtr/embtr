import React from 'react';
import { View, ScrollView, RefreshControl } from 'react-native';
import { UpcomingChallenge } from 'src/components/challenge/UpcomingChallenge';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { Challenge } from 'resources/schema';
import { CARD_SHADOW } from 'src/util/constants';

export const UpcomingChallenges = () => {
    const [challenges, setChallenges] = React.useState<Challenge[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);

    const fetch = async () => {
        const challenges = await ChallengeController.getAll();
        setChallenges(challenges);
    };

    React.useEffect(() => {
        fetch();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetch();
        setRefreshing(false);
    };

    const challengeElements: JSX.Element[] = [];
    for (const challenge of challenges) {
        const challengeElement = (
            <View key={challenge.id} style={[{ paddingTop: 5 }, CARD_SHADOW]}>
                <UpcomingChallenge challenge={challenge} />
            </View>
        );

        challengeElements.push(challengeElement);
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={{ height: '100%' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={{ paddingLeft: 5, paddingRight: 5, paddingBottom: 5 }}>
                    {challengeElements}
                </View>
            </ScrollView>
        </View>
    );
};
