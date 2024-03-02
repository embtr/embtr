import * as React from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { formatDistance } from 'date-fns';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { UsernameTagTracker } from 'src/util/user/UsernameTagTracker';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE } from 'src/util/constants';
import { Comment } from 'resources/schema';
import { PremiumBadge } from '../PremiumBadge';

interface Props {
    comment: Comment;
    index: number;
    isOwnPost: boolean;
}

export const CommentBoxComment = ({ comment, isOwnPost }: Props) => {
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
        <View
            style={{
                borderRadius: 5,
                backgroundColor: isOwnPost ? colors.accent_color_dim : colors.card_background,
                padding: PADDING_LARGE / 2,
            }}
        >
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <NavigatableUserImage user={comment.user!} size={35} />

                <View
                    style={{
                        paddingLeft: 5,
                        flex: 1,
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                color: colors.secondary_text,
                                fontFamily: POPPINS_MEDIUM,
                                fontSize: 14,
                            }}
                        >
                            {comment.user?.displayName}
                        </Text>
                        <View
                            style={{
                                paddingLeft: 1.5,
                            }}
                        >
                            <PremiumBadge user={comment.user!} size={14} />
                        </View>
                        <View style={{ flex: 1 }} />
                        <Text
                            style={{
                                textAlign: 'right',
                                color: colors.secondary_text,
                                fontSize: 8,
                            }}
                        >
                            {time}
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 12,
                            color: colors.text,
                        }}
                    >
                        {decodedComment}
                    </Text>
                </View>
            </View>

            <View style={{ height: PADDING_LARGE / 2 }} />
            {/* <View style={{ paddingRight: 30, justifyContent: 'center' }}>
                <Ionicons name={heartPressed ? 'heart' : 'heart-outline'} size={COMMENT_ICON_SIZE} color={heartPressed ? 'red' : colors.timeline_card_header} />
            </View> */}
        </View>
    );
};
