import * as React from 'react';
import { View, Text } from "react-native"
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { formatDistance } from 'date-fns';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { Comment } from 'src/controller/timeline/TimelineController';
import { UsernameTagTracker } from 'src/util/user/UsernameTagTracker';

interface Props {
    comment: Comment
}

export const CommentBoxComment = ({ comment }: Props) => {
    const { colors } = useTheme();

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);
    const [decodedComment, setDecodedComment] = React.useState<string>("");

    useFocusEffect(
        React.useCallback(() => {
            if (comment && comment.uid) {
                ProfileController.getProfile(comment.uid, setUserProfileModel);
            }
        }, [comment, comment.uid])
    );

    const time = formatDistance(comment.timestamp.toDate(), new Date(), { addSuffix: true });
    UsernameTagTracker.dencodeTaggedUsers(comment.comment, setDecodedComment);

    return (
        <View>
            <View style={{ flexDirection: "row", marginRight: 10, marginLeft: 10 }}>
                <View>
                    {userProfileModel && <NavigatableUserImage userProfileModel={userProfileModel} size={30} />}

                </View>
                <View style={{ marginLeft: 5, marginRight: 20, flexShrink: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "bold" }}>{userProfileModel?.name} <Text style={{ color: colors.text, fontWeight: "normal" }}>{decodedComment}</Text></Text>
                    <Text style={{ color: "gray", fontSize: 12 }}>{time}</Text>
                </View>
            </View>
        </View>
    )
}