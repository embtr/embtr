import React from 'react';
import { View, RefreshControl, Pressable } from 'react-native';
import { UpcomingChallenge } from 'src/components/challenge/UpcomingChallenge';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { CARD_SHADOW } from 'src/util/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChallengeTabScreens } from 'src/navigation/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

type navigationProp = StackNavigationProp<ChallengeTabScreens, 'ChallengeDetails'>;

export const UpcomingChallenges = () => {
    const [refreshing, setRefreshing] = React.useState(false);
    const navigation = useNavigation<navigationProp>();

    const challenges = ChallengeController.useGetChallenges();

    const onRefresh = async () => {
        setRefreshing(true);
        await challenges.refresh();
        setRefreshing(false);
    };

    const challengeElements: JSX.Element[] = [];
    for (const challenge of challenges.challenges) {
        const challengeElement = (
            <Pressable
                key={challenge.id}
                onPress={() => {
                    if (!challenge.id) {
                        return;
                    }
                    navigation.navigate('ChallengeDetails', { id: challenge.id });
                }}
                style={{
                    ...CARD_SHADOW, // Assuming CARD_SHADOW is the style for card shadow
                    width: '100%',
                }}
            >
                <UpcomingChallenge challenge={challenge} />
            </Pressable>
        );

        challengeElements.push(challengeElement);
    }

    const pairViews: JSX.Element[] = [];
    for (let i = 0; i < challengeElements.length; i += 2) {
        const pairView = (
            <View
                key={i}
                style={{
                    flexDirection: 'row',
                    width: '100%',
                    marginBottom: 10, // Adjust the margin between rows as needed
                }}
            >
                <View style={{ flex: 1, paddingLeft: 5, paddingRight: 3.5 }}>
                    {challengeElements[i]}
                </View>
                <View style={{ flex: 1, paddingLeft: 3.5, paddingRight: 5 }}>
                    {challengeElements[i + 1]}
                </View>
            </View>
        );

        pairViews.push(pairView);
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView
                style={{ height: '100%' }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                <View style={{ height: 5 }} />
                {pairViews}
            </ScrollView>
        </View>
    );
};
