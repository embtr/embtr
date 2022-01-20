import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, TextStyle, View, Image, StyleSheet } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { EditUserProfileButton } from 'src/components/profile/EditUserProfileButton';
import { FollowUserButton } from 'src/components/profile/FollowUserButton';
import { useTheme } from 'src/components/theme/ThemeProvider';
import FollowerController, { FollowCounts } from 'src/controller/follower/FollowerController';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { EditableTextBox } from 'src/components/common/textbox/EditableTextBox';
import ProfileController from 'src/controller/profile/ProfileController';

interface Props {
    userProfileModel?: UserProfileModel,
    onFollowUser: Function,
    onUnfollowUser: Function,
    followerCount: number,
    followingCount: number,
    isFollowingUser: boolean
}

export const ProfileHeader = ({ userProfileModel, onFollowUser, onUnfollowUser, followerCount, followingCount, isFollowingUser }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 14,
        color: colors.text,
    } as TextStyle;

    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);

    const [shouldDisplayFollowButton, setShouldDisplayFollowButton] = React.useState(false);
    const [shouldDisplayEditProfileButton, setShouldDisplayEditProfileButton] = React.useState(false);

    const [newBioText, setNewBioText] = React.useState<string | undefined>(undefined);
    const [newNameText, setNewNameText] = React.useState<string | undefined>(undefined);
    const [profileIsEditable, setProfileIsEditable] = React.useState(false);

    React.useEffect(() => {
        setShouldDisplayFollowButton(currentUserId !== undefined && userProfileModel !== undefined && userProfileModel.uid !== currentUserId);
        setShouldDisplayEditProfileButton(currentUserId !== undefined && userProfileModel !== undefined && userProfileModel.uid === currentUserId);
    }, [currentUserId && userProfileModel]);

    useFocusEffect(
        React.useCallback(() => {
            getCurrentUserUid(setCurrentUserId);
        }, [])
    );

    const saveProfile = () => {
        let executeUpdate = false;

        if (userProfileModel) {
            if (newBioText !== undefined) {
                userProfileModel.bio = newBioText;
                executeUpdate = true;
            }

            if (newNameText !== undefined) {
                userProfileModel.name = newNameText;
                userProfileModel.nameLower = newNameText.toLowerCase();
                executeUpdate = true;
            }

            if (executeUpdate) {
                ProfileController.updateProfile(userProfileModel);
            }
        }
    }

    const onToggleProfileEdit = () => {
        if (profileIsEditable) {
            saveProfile();
        }

        setProfileIsEditable(!profileIsEditable);
    }

    return (
        <View>
            <View style={{ flexDirection: "row" }}>
                <View style={{ flex: 12 }}>
                    <View style={{ paddingLeft: 25, paddingTop: 15 }}><Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: userProfileModel ? userProfileModel.photoUrl : "" }} /></View>
                    <View style={{ paddingLeft: 15, paddingTop: 15 }}>
                        <EditableTextBox text={newNameText !== undefined ? newNameText : userProfileModel?.name ? userProfileModel.name : ""} textSize={24} onChangeText={setNewNameText} editable={profileIsEditable} />
                    </View>
                </View>

                <View style={{ flex: 12, flexDirection: "column" }}>
                    <View style={{ flex: 1, flexDirection: "row" }}>

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

                    <View style={{ flex: 1, flexDirection: "row" }}>

                        <View style={{ flex: 10, flexDirection: "column", alignItems: "center" }}>
                            <View style={{ flex: 1 }} />
                            <View style={{ flex: 10 }}>
                                {shouldDisplayFollowButton && <FollowUserButton userProfileModel={userProfileModel!} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} following={isFollowingUser} />}
                                {shouldDisplayEditProfileButton && <EditUserProfileButton showEdit={profileIsEditable} onPress={onToggleProfileEdit} />}
                            </View>
                        </View>
                        <View style={{ flex: 2 }} />

                    </View>
                </View>

            </View>
            <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15 }}>
                <EditableTextBox text={newBioText !== undefined ? newBioText : userProfileModel?.bio ? userProfileModel.bio : ""} textSize={14} onChangeText={setNewBioText} editable={profileIsEditable} />
            </View>
            <HorizontalLine />
        </View>
    )
}