import React from 'react';
import { Keyboard, View } from 'react-native';
import { Challenge, ChallengeParticipant, Comment, User } from 'resources/schema';
import { RouteProp, useFocusEffect, useRoute } from '@react-navigation/native';
import { ChallengeTabScreens } from 'src/navigation/RootStackParamList';
import { ChallengeController } from 'src/controller/challenge/ChallengeController';
import { Screen } from '../../Screen';
import { ChallengeBody } from './ChallengeBody';
import { Banner } from '../../Banner';
import { HorizontalLine } from '../../HorizontalLine';
import PostDetailsActionBar from '../../comments/PostDetailsActionBar';
import { getUserIdFromToken } from 'src/util/user/CurrentUserUtil';
import ScrollableTextInputBox from '../../textbox/ScrollableTextInputBox';
import { CommentsScrollView } from '../../comments/CommentsScrollView';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';

export const ChallengeDetails = () => {
    const route = useRoute<RouteProp<ChallengeTabScreens, 'ChallengeDetails'>>();

    const [challenge, setChallenge] = React.useState<Challenge>();
    const [comments, setComments] = React.useState<Comment[]>([]);

    const [likeCount, setLikeCount] = React.useState(0);
    const [isLiked, setIsLiked] = React.useState(false);

    const currentUser = useAppSelector(getCurrentUser);

    React.useEffect(() => {
        const fetch = async () => {
            if (!challenge?.id) {
                return;
            }

            const currentUserId = await getUserIdFromToken();

            const userHasLiked = challenge?.likes?.some(
                (like: ChallengeParticipant) => like.userId === currentUserId
            );

            setComments(challenge.comments ?? []);
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

    const likeChallenge = () => {
        if (!challenge.id) {
            return;
        }

        ChallengeController.like(challenge.id);
        setIsLiked(true);
        setLikeCount(likeCount + 1);
    };

    const submitComment = async (comment: string, taggedUsers: string[]) => {
        Keyboard.dismiss();

        if (!challenge.id) {
            return;
        }

        const preSaveUpdatedComments = [...comments];
        preSaveUpdatedComments.push({
            comment,
            createdAt: new Date(),
            user: currentUser,
        });
        setComments(preSaveUpdatedComments);

        const addedComment = await ChallengeController.comment(challenge.id, comment);

        const postSaveUpdatedComments = [...comments];
        postSaveUpdatedComments.push({
            id: addedComment.id,
            comment,
            createdAt: new Date(),
            user: currentUser,
        });
        setComments(postSaveUpdatedComments);
    };

    const deleteComment = async (comment: Comment) => {
        if (challenge.id) {
            await ChallengeController.deleteComment(comment);
            //dispatch(addTimelineCardRefreshRequest('RESULT_' + plannedDayResult.id));
            const updatedComments = comments.filter((c) => c.id !== comment.id);
            setComments(updatedComments);
        }
    };

    return (
        <Screen>
            <ScrollableTextInputBox submitComment={submitComment}>
                <Banner name="Challenge Details" leftText="back" leftRoute="BACK" />
                <HorizontalLine />

                <View style={{ padding: 7.5 }}>
                    <ChallengeBody challenge={challenge} />
                </View>

                <PostDetailsActionBar
                    likeCount={likeCount}
                    isLiked={isLiked}
                    commentCount={comments.length}
                    onLike={likeChallenge}
                />
                <HorizontalLine />

                <CommentsScrollView comments={comments} onDeleteComment={deleteComment} />
            </ScrollableTextInputBox>
        </Screen>
    );
};
