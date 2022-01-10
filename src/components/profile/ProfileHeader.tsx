import { useFocusEffect } from '@react-navigation/native';
import * as React from 'react';
import { Text, TextStyle, View, Image } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import FollowerController from 'src/controller/follower/FollowerController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';

interface Props {
    userProfileModel: UserProfileModel
}

export const ProfileHeader = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 14,
        color: colors.text,
    } as TextStyle;

    const [followerCount, setFollowerCount] = React.useState<number>(0);
    const [followingCount, setFollowingCount] = React.useState<number>(0);

    useFocusEffect(() => {
        FollowerController.getFollowers(userProfileModel.uid!, (followers: string[]) => {
            setFollowerCount(followers.length);
        });

        FollowerController.getFollowing(userProfileModel.uid!, (following: string[]) => {
            setFollowingCount(following.length);

        });
    });

    return (
        <View>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 12 }}>
                    <View style={{ paddingLeft: 25, paddingTop: 15 }}><Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: userProfileModel.photoUrl }} /></View>
                    <View style={{ paddingLeft: 15, paddingTop: 15 }}><Text style={[textStyle, { fontSize: 24 }]}>{userProfileModel.name}</Text></View>
                </View>

                <View style={{ flex: 12, flexDirection: "row" }}>

                    <View style={{ flex: 5, flexDirection: "column" }}>
                        <View><Text style={[textStyle, { textAlign: "center", paddingTop: 30 }]}>{followerCount}</Text></View>
                        <View><Text style={[textStyle, { textAlign: "center", paddingTop: 5 }]}>followers</Text></View>
                    </View>

                    <View style={{ flex: 5, flexDirection: "column" }}>
                        <View><Text style={[textStyle, { textAlign: "center", paddingTop: 30 }]}>{followingCount}</Text></View>
                        <View><Text style={[textStyle, { textAlign: "center", paddingTop: 5 }]}>following</Text></View>
                    </View>
                    <View style={{ flex: 2 }} />

                </View>

            </View>
            <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15 }}>
                <Text style={textStyle}>{userProfileModel.bio}</Text>
            </View>
            <HorizontalLine />
        </View>
    )
}