import React from 'react';
import { View, ScrollView, RefreshControl, Pressable } from 'react-native';
import { UpcomingChallenge } from 'src/components/challenge/UpcomingChallenge';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { Challenge } from 'resources/schema';
import { CARD_SHADOW } from 'src/util/constants';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChallengeTabScreens } from 'src/navigation/RootStackParamList';
import { useNavigation } from '@react-navigation/native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

type navigationProp = StackNavigationProp<ChallengeTabScreens, 'ChallengeDetails'>;

export const UpcomingChallenges = () => {
    const [challenges, setChallenges] = React.useState<Challenge[]>([]);
    const [refreshing, setRefreshing] = React.useState(false);
    const navigation = useNavigation<navigationProp>();

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
                <TouchableWithoutFeedback
                    onPress={() => {
                        if (!challenge.id) {
                            return;
                        }

                        navigation.navigate('ChallengeDetails', { id: challenge.id });
                    }}
                >
                    <UpcomingChallenge challenge={challenge} />
                </TouchableWithoutFeedback>
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
