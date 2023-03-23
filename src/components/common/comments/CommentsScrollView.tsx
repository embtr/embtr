import { View } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { Comment } from 'src/controller/timeline/TimelineController';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import SwipeableDeleteCard from '../swipeable/SwipeableDeleteCard';
import { PlannedDayResultComment } from 'resources/schema';

interface Props {
    onDeleteComment?: Function;
    comments: PlannedDayResultComment[];
    limit?: number;
}

export const CommentsScrollView = ({ comments, onDeleteComment, limit }: Props) => {
    let commentViews: JSX.Element[] = [];

    let max = limit ? limit : comments.length;
    if (comments.length < max) {
        max = comments.length;
    }

    for (let i = 0; i < max; i++) {
        const comment: PlannedDayResultComment = comments[i];

        const isCurrentUsersComment = comment.user?.uid === getCurrentUid();

        if (isCurrentUsersComment) {
            commentViews.push(
                <SwipeableDeleteCard
                    key={comment.id}
                    onDelete={() => {
                        if (onDeleteComment) {
                            onDeleteComment(comment);
                        }
                    }}
                >
                    <View key={comment.id} style={{ marginBottom: 7.5, paddingTop: 15 }}>
                        <CommentBoxComment comment={comment} />
                    </View>
                </SwipeableDeleteCard>
            );
        } else {
            commentViews.push(
                <View key={comment.id} style={{ marginBottom: 7.5, paddingTop: 15 }}>
                    <CommentBoxComment comment={comment} />
                </View>
            );
        }
    }

    return <View>{commentViews}</View>;
};
