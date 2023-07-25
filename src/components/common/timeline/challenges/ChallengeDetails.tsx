import React from 'react';
import { View } from 'react-native';
import { PostDetails } from '../../comments/PostDetails';
import { Challenge, ChallengeParticipant, User } from 'resources/schema';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { ChallengeTabScreens } from 'src/navigation/RootStackParamList';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ChallengeDetailsBody } from 'src/components/challenge/ChallengeDetailsBody';
import { Screen } from '../../Screen';
import { ChallengeBody } from './ChallengeBody';
import { Banner } from '../../Banner';
import { HorizontalLine } from '../../HorizontalLine';
import PostDetailsActionBar from '../../comments/PostDetailsActionBar';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';

export const ChallengeDetails = () => {
    const route = useRoute<RouteProp<ChallengeTabScreens, 'ChallengeDetails'>>();
    const { colors } = useTheme();

    const [challenge, setChallenge] = React.useState<Challenge>();

    const [likeCount, setLikeCount] = React.useState(0);
    const [isLiked, setIsLiked] = React.useState(false);

    React.useEffect(() => {
        const fetch = async () => {
            if (!challenge?.id) {
                return;
            }

            const currentUserId = await getUserIdFromToken();

            const userHasLiked = challenge?.likes?.some(
                (like: ChallengeParticipant) => like.userId === currentUserId
            );

            setLikeCount(challenge.likes?.length || 0);
            setIsLiked(userHasLiked || false);
        };

        fetch();
    }, [challenge]);

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

    const likeChallenge = () => {
        if (!challenge.id) {
            return;
        }

        ChallengeController.like(challenge.id);
        setIsLiked(true);
        setLikeCount(likeCount + 1);
    };

    return (
        <View style={{ width: '100%', height: '100%', backgroundColor: colors.background }}>
            <Banner name="Challenge Details" />
            <HorizontalLine />
            <View style={{ padding: 7.5 }}>
                <ChallengeBody challenge={challenge} />
            </View>

            <PostDetailsActionBar
                likeCount={likeCount}
                isLiked={isLiked}
                commentCount={challenge.comments?.length ?? 0}
                onLike={likeChallenge}
            />
            <HorizontalLine />
        </View>
    );
};
