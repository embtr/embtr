import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import FollowerController from 'src/controller/follower/FollowerController';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';

type userProfileScreenProp = StackNavigationProp<RootStackParamList, 'UserProfile'>;

interface Props {
    userProfileModel: UserProfileModel,
    following: boolean
}

export const UserSearchResult = ({ userProfileModel, following }: Props) => {
    const { colors } = useTheme();

    const [followOverride, setFollowOverride] = React.useState<boolean>(following);

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const navigation = useNavigation<userProfileScreenProp>();

    return (
        <View style={{ width: isDesktopBrowser() ? "60%" : "100%" }}>
            <TouchableOpacity onPress={() => { navigation.navigate('UserProfile', { userProfileModel: userProfileModel }) }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 10 }}>
                    <View style={{ marginRight: 10 }}><Image style={{ width: 35, height: 35, borderRadius: 50, marginLeft: 10, marginRight: 10 }} source={{ uri: userProfileModel?.photoUrl }} /></View>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 10, flex: 1 }}>
                        <View style={{ flex: 8 }}><Text style={textStyle}>{userProfileModel?.name}</Text></View>
                        {followOverride
                            ? <View style={{ flex: 5 }}>
                                <EmbtrButton buttonText='unfollow' size='small' callback={() => {
                                    FollowerController.unfollowUser(getCurrentUserUid(), userProfileModel.uid!, () => {
                                        setFollowOverride(false);
                                    })
                                }} />
                            </View>
                            : <View style={{ flex: 5 }}>
                                <EmbtrButton buttonText='follow' size='small' callback={() => {
                                    FollowerController.followUser(getCurrentUserUid(), userProfileModel.uid!, () => {
                                        setFollowOverride(true);
                                    })
                                }} />
                            </View>}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}