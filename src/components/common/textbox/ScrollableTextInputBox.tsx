import React from 'react';
import { CommentsTextInput } from 'src/components/common/comments/CommentsTextInput';
import { KeyboardAvoidingView } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { isIosApp } from 'src/util/DeviceUtil';

interface Props {
    submitComment: Function;
    children: any;
}

const ScrollableTextInputBox = ({ submitComment, children }: Props) => {
    const scrollRef = React.useRef<ScrollView>(null);

    const onCommentCountChanged = (width: number, height: number) => {
        //scrollRef.current?.scrollTo({ x: 0, y: height, animated: true });
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            keyboardVerticalOffset={isIosApp() ? 40 : -218}
            behavior={isIosApp() ? 'padding' : 'padding'}
        >
            <ScrollView
                style={{ flex: 1 }}
                onContentSizeChange={onCommentCountChanged}
                ref={scrollRef}
            >
                {children}
            </ScrollView>

            <CommentsTextInput submitComment={submitComment} />
        </KeyboardAvoidingView>
    );
};

export default ScrollableTextInputBox;
