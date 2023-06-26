import { View } from 'react-native';
import { PostDetails } from '../../comments/PostDetails';
import { UserPostBody } from '../../comments/UserPostBody';
import { Challenge, User } from 'resources/schema';
import { RouteProp, useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { ChallengeTabScreens, TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeDetailsBody } from 'src/components/challenge/ChallengeDetailsBody';
import { Screen } from '../../Screen';

export const ChallengeDetails = () => {
    const route = useRoute<RouteProp<ChallengeTabScreens, 'ChallengeDetails'>>();
    const { colors } = useTheme();

    const [challenge, setChallenge] = React.useState<Challenge>();

    const fetch = async () => {
        const challenge = await ChallengeController.get(route.params.id);
        setChallenge(challenge);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetch();
        }, [])
    );

    React.useEffect(() => {
        fetch();
    }, []);

    if (!challenge?.creator) {
        return (
            <Screen>
                <View />
            </Screen>
        );
    }

    const author: User = challenge?.creator;

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: colors.background }}>
            <PostDetails
                type={'Challenge Details'}
                author={author}
                added={challenge?.createdAt ?? new Date()}
                likes={challenge?.likes ?? []}
                comments={challenge?.comments ?? []}
                onLike={() => {}}
                submitComment={(comment: string, taggedUsers: string[]) => {
                    if (!challenge.id) {
                        return;
                    }

                    ChallengeController.comment(challenge.id, comment);
                }}
                deleteComment={() => {}}
                onEdit={() => {}}
                onDelete={() => {}}
            >
                <ChallengeDetailsBody challenge={challenge} />
            </PostDetails>
        </View>
    );
};
