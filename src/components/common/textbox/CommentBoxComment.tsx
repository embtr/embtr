import * as React from 'react';
import { View, Image, Text } from "react-native"
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Comment } from 'src/controller/explore/ExploreController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';

interface Props {
    comment: Comment
}

export const CommentBoxComment = ({ comment }: Props) => {
    const { colors } = useTheme();

    const [userProfileModel, setUserProfileModel] = React.useState<UserProfileModel | undefined>(undefined);

    useFocusEffect(
        React.useCallback(() => {
            if (comment && comment.uid) {
                ProfileController.getProfile(comment.uid, setUserProfileModel);
            }
        }, [comment, comment.uid])
    );

    return (
        <View>
            <View style={{ flexDirection: "row", marginRight: 10, marginLeft: 10 }}>
                <View>
                    <Image style={{ width: 30, height: 30, borderRadius: 50 }} source={{ uri: userProfileModel ? userProfileModel.photoUrl : undefined }} />

                </View>
                <View style={{ marginLeft: 5, marginRight: 20, flexShrink: 1 }}>
                    <Text style={{ color: colors.text, fontWeight: "bold" }}>{userProfileModel?.name} <Text style={{ color: colors.text, fontWeight: "normal" }}>{comment.comment}</Text></Text>
                    <Text style={{ color: "gray", fontSize: 12 }}>2 minutes ago</Text>
                </View>
            </View>
        </View>
    )
}