import * as React from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { formatDistance } from 'date-fns';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { UsernameTagTracker } from 'src/util/user/UsernameTagTracker';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { Comment } from 'resources/schema';

interface Props {
    comment: Comment;
    index: number;
}

export const CommentBoxComment = ({ comment, index }: Props) => {
    const { colors } = useTheme();

    const [decodedComment, setDecodedComment] = React.useState<JSX.Element | undefined>(undefined);

    const heartPressed = false;

    useFocusEffect(
        React.useCallback(() => {
            if (comment && comment.comment) {
                UsernameTagTracker.dencodeTaggedUsers(comment.comment, colors, setDecodedComment);
            }
        }, [comment])
    );

    const time = formatDistance(comment.createdAt ?? new Date(), new Date(), { addSuffix: true });
    return (
        <View style={{ paddingHorizontal: TIMELINE_CARD_PADDING }}>
            <View
                style={{
                    flexDirection: 'row',
                    borderRadius: 5,
                    backgroundColor: '#322C30',
                    //backgroundColor: '#362B35',
                }}
            >
                <View style={{ flexDirection: 'row', padding: TIMELINE_CARD_PADDING / 2, flex: 1 }}>
                    <NavigatableUserImage user={comment.user!} size={30} />

                    <View style={{ marginLeft: 5, marginRight: 20, flexShrink: 1, paddingLeft: 5 }}>
                        <Text
                            style={{
                                color: colors.timeline_card_header,
                                fontWeight: 'bold',
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 14,
                            }}
                        >
                            {comment.user?.displayName}
                        </Text>
                        {decodedComment && (
                            <Text
                                style={{
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 12,
                                    color: colors.timeline_card_header,
                                    paddingTop: 1,
                                }}
                            >
                                {decodedComment}
                            </Text>
                        )}
                        <Text style={{ color: colors.secondary_text, fontSize: 10, paddingTop: 1 }}>
                            {time}
                        </Text>
                    </View>
                </View>

                {/* <View style={{ paddingRight: 30, justifyContent: 'center' }}>
                <Ionicons name={heartPressed ? 'heart' : 'heart-outline'} size={COMMENT_ICON_SIZE} color={heartPressed ? 'red' : colors.timeline_card_header} />
            </View> */}
            </View>
        </View>
    );
};
