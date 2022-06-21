import * as React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { StackNavigationProp } from '@react-navigation/stack';
import { TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { FollowUserButton } from 'src/components/profile/FollowUserButton';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { useFonts, Poppins_500Medium } from '@expo-google-fonts/poppins';
import { USER_SEARCH_WIDTH } from 'src/util/constants';

type userProfileScreenProp = StackNavigationProp<TimelineTabScreens, 'UserProfile'>;

interface Props {
    userProfileModel: UserProfileModel,
    onFollowUser: Function,
    onUnfollowUser: Function,
    following: boolean
}

export const UserSearchResult = ({ userProfileModel, onFollowUser, onUnfollowUser, following }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<userProfileScreenProp>();

    let [fontsLoaded] = useFonts({
        Poppins_500Medium,
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View style={{ width: "100%", alignItems: "center" }}>
            <TouchableOpacity style={{ width: USER_SEARCH_WIDTH }} onPress={() => { navigation.navigate('UserProfile', { id: userProfileModel.uid! }) }}>
                <View style={{ backgroundColor: colors.button_background, alignItems: "center", height: 75, borderRadius: 15, width: "100%", flexDirection: "row", paddingLeft: 10 }}>
                    <View style={{ flex: 2, flexDirection: "row", alignItems: "center" }}>
                        <NavigatableUserImage userProfileModel={userProfileModel} size={35} />
                        <Text style={{ fontFamily: "Poppins_500Medium", fontSize: 15, color: colors.user_search_name, paddingLeft: 10 }}>{userProfileModel?.name}</Text>
                    </View>

                    <View style={{ flex: 1, alignContent: "center", alignItems: "center" }}>
                        <FollowUserButton userProfileModel={userProfileModel} onFollowUser={onFollowUser} onUnfollowUser={onUnfollowUser} following={following} />
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}