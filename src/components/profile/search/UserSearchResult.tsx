import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, TextStyle, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { isDesktopBrowser } from 'src/util/DeviceUtil';
import { FollowUserButton } from 'src/components/profile/FollowUserButton';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    userProfileModel: UserProfileModel,
    onFollowUser: Function,
    onUnfollowUser: Function,
    following: boolean
}

export const UserSearchResult = ({ userProfileModel, onFollowUser, onUnfollowUser, following }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 18,
        color: colors.text,
    } as TextStyle;

    const navigation = useNavigation<userProfileScreenProp>();

    return (
        <View style={{ width: isDesktopBrowser() ? "60%" : "100%" }}>
            <TouchableOpacity onPress={() => { navigation.navigate('UserProfile', { id: userProfileModel.uid! }) }}>
                <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 10 }}>
                    <View style={{ marginLeft: 10, marginRight: 10 }}><NavigatableUserImage userProfileModel={userProfileModel} size={35} /></View>
                    <View style={{ flexDirection: "row", alignItems: "center", paddingTop: 10, paddingBottom: 10, flex: 1 }}>
                        <View style={{ flex: 7 }}><Text style={textStyle}>{userProfileModel?.name}</Text></View>

                        <View style={{ flex: 5 }}>
                            <FollowUserButton userProfileModel={userProfileModel} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} following={following} />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}