import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { useFonts, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import { ProfileLevel } from 'src/components/profile/profile_component/ProfileLevel';
import { UserProfileProBadge } from 'src/components/profile/profile_component/badge/UserProfileProBadge';
import ProfileBannerImage from 'src/components/profile/profile_component/ProfileBannerImage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { getAuth } from 'firebase/auth';
import { CachedImage } from 'src/components/common/images/CachedImage';
import { LevelProgress } from './level_progress/LevelProgress';

interface Props {
    userProfileModel: UserProfileModel;
    onFollowUser: Function;
    onUnfollowUser: Function;
    followerCount: number;
    followingCount: number;
    isFollowingUser: boolean;
}

export const ProfileHeader = ({ userProfileModel, onFollowUser, onUnfollowUser, followerCount, followingCount, isFollowingUser }: Props) => {
    const { colors } = useTheme();

    const shouldDisplayFollowButton =
        getAuth().currentUser!.uid !== undefined && userProfileModel !== undefined && userProfileModel.uid !== getAuth().currentUser!.uid;

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View />;
    }

    return (
        <View>
            <View style={{ width: '100%', height: 180, backgroundColor: colors.background }}>
                <View style={{ width: '100%', height: '100%', alignItems: 'center', paddingTop: 10 }}>
                    <View style={{ width: '100%' }}>
                        <ProfileBannerImage sourceUrl={userProfileModel?.bannerUrl} />
                    </View>
                </View>

                <View style={{ width: '100%', height: '100%', position: 'absolute', zIndex: 2, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                        {userProfileModel.photoUrl && <CachedImage style={{ width: 100, height: 100, borderRadius: 50 }} uri={userProfileModel.photoUrl} />}
                        <View style={{ position: 'absolute', zIndex: 1, paddingBottom: 3, paddingRight: 3 }}>
                            <ProfileLevel userProfileModel={userProfileModel} />
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ alignItems: 'center', backgroundColor: colors.background }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 18, fontFamily: 'Poppins_600SemiBold', color: colors.profile_name_text, paddingLeft: 90 }}>
                        {userProfileModel?.name}
                    </Text>
                    <View style={{ flexDirection: 'row', paddingLeft: 10, width: 90 }}>
                        <UserProfileProBadge />
                        {shouldDisplayFollowButton && (
                            <TouchableOpacity
                                onPress={() => {
                                    if (isFollowingUser) {
                                        onUnfollowUser(userProfileModel.uid);
                                    } else {
                                        onFollowUser(userProfileModel.uid);
                                    }
                                }}
                            >
                                <View
                                    style={{
                                        backgroundColor: colors.profile_following_background,
                                        borderRadius: 8,
                                        borderColor: colors.profile_following_border,
                                        borderWidth: 1,
                                        marginLeft: 10,
                                        height: 20,
                                        width: 80,
                                        alignItems: 'center',
                                    }}
                                >
                                    <Text style={{ color: colors.profile_following_text, fontFamily: 'Poppins_500Medium' }}>
                                        {isFollowingUser ? ' Following ' : ' Follow '}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <Text style={{ fontSize: 10, fontFamily: 'Poppins_500Medium', color: colors.profile_bio_text }}>{userProfileModel?.location}</Text>
                <Text style={{ fontSize: 12, fontFamily: 'Poppins_500Medium', color: colors.profile_bio_text, paddingTop: 3 }}>{userProfileModel?.bio}</Text>
            </View>

            {/* FOLLOWERS/ FOLLOWING */}
            <View style={{ paddingBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 10, backgroundColor: colors.background }}>
                    {/* FOLLOWERS */}
                    <View
                        style={{
                            paddingLeft: 15,
                            paddingRight: 15,
                            paddingTop: 10,
                            paddingBottom: 10,
                            backgroundColor: colors.profile_following_background,
                            borderRadius: 10,
                            marginRight: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1.5,
                            borderColor: colors.profile_following_border,
                        }}
                    >
                        <Text style={{ fontSize: 14, fontFamily: 'Poppins_500Medium', color: colors.profile_following_text }}>{followerCount} Followers</Text>
                    </View>

                    {/* FOLLOWING */}
                    <View
                        style={{
                            paddingLeft: 15,
                            paddingRight: 15,
                            paddingTop: 10,
                            paddingBottom: 10,
                            backgroundColor: colors.profile_following_background,
                            borderRadius: 10,
                            marginLeft: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderWidth: 1.5,
                            borderColor: colors.profile_following_border,
                        }}
                    >
                        <Text style={{ fontSize: 14, fontFamily: 'Poppins_500Medium', color: colors.profile_following_text }}>{followingCount} Following</Text>
                    </View>
                </View>
            </View>

            <View style={{ width: '100%', alignItems: 'center' }}>
                <View style={{ width: '98%', alignItems: 'center' }}>
                    <LevelProgress user={userProfileModel} />
                </View>
            </View>
        </View>
    );
};
