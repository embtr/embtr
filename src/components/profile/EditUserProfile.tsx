import * as React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TextInput, Keyboard } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { getCurrentUserUid } from 'src/session/CurrentUserProvider';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';

interface Props {
    userProfileModel?: UserProfileModel,
    onFollowUser: Function,
    onUnfollowUser: Function,
    followerCount: number,
    followingCount: number,
    isFollowingUser: boolean
}

export const EditUserProfile = ({ userProfileModel }: Props) => {
    const { colors } = useTheme();

    const [currentUserId, setCurrentUserId] = React.useState<string | undefined>(undefined);

    const [newBioText, setNewBioText] = React.useState<string | undefined>(undefined);
    const [newNameText, setNewNameText] = React.useState<string | undefined>(undefined);
    const [newLocation, setNewLocation] = React.useState<string>("");
    const [profileIsEditable, setProfileIsEditable] = React.useState(false);

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
        <Screen>
            <Banner name='Edit Profile' leftIcon={"arrow-back"} leftRoute="BACK" />

            <View style={{ paddingTop: 10, alignItems: "center" }}>
                <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, paddingTop: 15, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Name</Text>
                <TextInput
                    style={{ padding: 15, fontFamily: "Poppins_400Regular", color: colors.goal_primary_font, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, width: "95%" }}
                    placeholder={"Enter name"}
                    placeholderTextColor={colors.secondary_text}
                    onChangeText={setNewNameText}
                    value={newNameText}
                    autoCorrect={true}
                />
            </View>

            <View style={{ paddingTop: 15, alignItems: "center" }}>
                <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Bio</Text>
                <TextInput
                    textAlignVertical='top'
                    style={{ width: "95%", fontFamily: "Poppins_400Regular", height: 200, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, color: colors.text, paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}
                    multiline={true}
                    placeholder={"Enter bio"}
                    placeholderTextColor={colors.secondary_text}
                    onChangeText={setNewBioText}
                    value={newBioText}
                    autoCorrect={true}
                />
            </View>

            <View style={{ paddingTop: 10, alignItems: "center" }}>
                <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, paddingTop: 15, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Location</Text>
                <TextInput
                    style={{ padding: 15, fontFamily: "Poppins_400Regular", color: colors.goal_primary_font, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, width: "95%" }}
                    placeholder={"Enter location"}
                    placeholderTextColor={colors.secondary_text}
                    onChangeText={setNewLocation}
                    value={newLocation}
                    autoCorrect={true}
                />
            </View>

            <View style={{ zIndex: -1, flex: 1, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'stretch', margin: 5, paddingBottom: 15 }}>
                <View style={{ width: "95%" }}>
                    <EmbtrButton buttonText={'Save'} callback={saveProfile} />
                </View>
            </View>
        </Screen>
    );
}