import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Comment } from 'src/controller/explore/ExploreController';

interface Props {
    comments: Comment[]
}

export const CommentsScrollView = ({ comments }: Props) => {
    const { colors } = useTheme();

    const scrollRef = React.useRef<ScrollView>(null);

    let commentViews: JSX.Element[] = [];
    comments.forEach(comment => {
        commentViews.push(
            <View key={comment.uid + comment.comment + comment.timestamp} style={{ marginBottom: 7.5, backgroundColor: colors.background }}>
                <CommentBoxComment comment={comment} />
            </View>
        );
    });

    const onCommentCountChanged = () => {
        scrollRef.current?.scrollToEnd();
    }

    return (
        <ScrollView onContentSizeChange={onCommentCountChanged} ref={scrollRef}>
            {commentViews}
        </ScrollView>
    );
}