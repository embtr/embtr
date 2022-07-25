import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, TextStyle, View, Image } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import ProfileController from 'src/controller/profile/ProfileController';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';


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

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View />
    }

    const onToggleProfileEdit = () => {
        if (profileIsEditable) {
            saveProfile();
        }

        setProfileIsEditable(!profileIsEditable);
    }

    const banner = require('assets/banner.png')

    return (
        <View>
            <View style={{ width: "100%", height: 180, backgroundColor: colors.background }}>
                <View style={{ width: "100%", height: "100%", position: "absolute", zIndex: 1, alignItems: "center", paddingTop: 10 }}>
                    <Image source={banner} style={{ width: "95%", height: 135, borderRadius: 15 }} />
                </View>

                <View style={{ width: "100%", height: "100%", position: "absolute", zIndex: 2, alignItems: "center", justifyContent: "flex-end" }}>
                    {userProfileModel && <View style={{ paddingBottom: 10 }}><Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: userProfileModel.photoUrl }} /></View>}
                </View>
            </View>

            <View style={{ alignItems: "center", backgroundColor: colors.background }}>
                <Text style={{ fontSize: 18, fontFamily: "Poppins_600SemiBold", color: colors.profile_name_text }}>{userProfileModel?.name}</Text>
                <Text style={{ fontSize: 12, fontFamily: "Poppins_500Medium", color: colors.profile_bio_text }}>{userProfileModel?.bio}</Text>
            </View>

            <View style={{ paddingBottom: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 10, backgroundColor: colors.background }}>
                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 15, paddingBottom: 15, backgroundColor: colors.profile_following_background, borderRadius: 10, marginRight: 20, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: colors.profile_following_border }}>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: colors.profile_following_text }}>{followingCount} Following</Text>
                    </View>

                    <View style={{ paddingLeft: 20, paddingRight: 20, paddingTop: 15, paddingBottom: 15, backgroundColor: colors.profile_following_background, borderRadius: 10, marginLeft: 20, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: colors.profile_following_border }}>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: colors.profile_following_text }}>{followerCount} Followers</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}