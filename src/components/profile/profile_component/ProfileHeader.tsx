import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, TextStyle, View, Image } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import ProfileController from 'src/controller/profile/ProfileController';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { ProfileLevel } from 'src/components/profile/profile_component/ProfileLevel';
import { UserProfileProBadge } from 'src/components/profile/profile_component/badge/UserProfileProBadge';
import ProfileBannerImage from 'src/components/profile/profile_component/ProfileBannerImage';


interface Props {
    userProfileModel: UserProfileModel,
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

    return (
        <View>
            <View style={{ width: "100%", height: 180, backgroundColor: colors.background }}>
                <View style={{ width: "100%", height: "100%", alignItems: "center", paddingTop: 10 }}>
                    <ProfileBannerImage sourceUrl={userProfileModel?.bannerUrl} />
                </View>

                <View style={{ width: "100%", height: "100%", position: "absolute", zIndex: 2, alignItems: "center", justifyContent: "flex-end" }}>

                    <View style={{ alignItems: "flex-end", justifyContent: "flex-end" }}>
                        <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: userProfileModel.photoUrl }} />
                        <View style={{ position: "absolute", zIndex: 1, paddingBottom: 3, paddingRight: 3 }}>
                            <ProfileLevel level={1} />
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ alignItems: "center", backgroundColor: colors.background }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 18, fontFamily: "Poppins_600SemiBold", color: colors.profile_name_text }}>
                        {userProfileModel?.name}
                    </Text>
                    <View style={{ paddingLeft: 10 }}>
                        <UserProfileProBadge />
                    </View>

                </View>

                <Text style={{ fontSize: 10, fontFamily: "Poppins_500Medium", color: colors.profile_bio_text }}>{userProfileModel?.location}</Text>
                <Text style={{ fontSize: 12, fontFamily: "Poppins_500Medium", color: colors.profile_bio_text, paddingTop: 3 }}>{userProfileModel?.bio}</Text>
            </View>

            <View style={{ paddingBottom: 20 }}>
                <View style={{ flexDirection: "row", justifyContent: "center", paddingTop: 10, backgroundColor: colors.background }}>
                    <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, backgroundColor: colors.profile_following_background, borderRadius: 10, marginRight: 15, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: colors.profile_following_border }}>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: colors.profile_following_text }}>{followerCount} Followers</Text>
                    </View>
                    <View style={{ paddingLeft: 15, paddingRight: 15, paddingTop: 10, paddingBottom: 10, backgroundColor: colors.profile_following_background, borderRadius: 10, marginLeft: 15, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: colors.profile_following_border }}>
                        <Text style={{ fontSize: 14, fontFamily: "Poppins_500Medium", color: colors.profile_following_text }}>{followingCount} Following</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}