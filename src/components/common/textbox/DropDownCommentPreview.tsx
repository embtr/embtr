import * as React from 'react';
import { View } from 'react-native';
import { CommentBoxComment } from 'src/components/common/textbox/CommentBoxComment';
import { Comment } from 'src/controller/explore/ExploreController';

interface Props {
    comment: Comment
}

export const DropDownCommentPreview = ({comment} : Props) => {
    return (
        <View style={{ width: "100%", overflow: "hidden" }}>
            <CommentBoxComment comment={comment} />
        </View>
    );
};