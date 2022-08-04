import React from 'react';
import { View, Text, TextInput, Keyboard, KeyboardAvoidingView, Image } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ProfileTabScreens, RootStackParamList } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { EmbtrButton } from 'src/components/common/button/EmbtrButton';
import { isIosApp } from 'src/util/DeviceUtil';
import { UserProfileModel, USER_PROFILE_SKELECTON } from 'src/firebase/firestore/profile/ProfileDao';
import ProfileController from 'src/controller/profile/ProfileController';
import { getAuth } from 'firebase/auth';
import { ScrollView } from 'react-native-gesture-handler';

export const EditProfile = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<ProfileTabScreens>>();

    const [userProfile, setUserProfile] = React.useState<UserProfileModel | undefined>();

    const [photoUrl, setPhotoUrl] = React.useState("");
    const [username, setUsername] = React.useState("");
    const [displayName, setDisplayName] = React.useState("");
    const [location, setLocation] = React.useState("");
    const [bio, setBio] = React.useState("");

    const placeholderOptions: string[] = ["I love pringles", "Smarter than your average", "Do people read these?", "Top 10 Horseshoe player on my street.", "Work Hard, Train Harder."];
    const [bioPlaceholder, setBioPlaceholder] = React.useState<string>(placeholderOptions[getRandomInt(0, placeholderOptions.length)]);

    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                let x = -1;
                while (x === -1) {
                    let newIndex = getRandomInt(0, placeholderOptions.length);
                    if (placeholderOptions[newIndex] !== bioPlaceholder) {
                        x = newIndex;
                    }
                }
                setBioPlaceholder(placeholderOptions[x]);
            }, 6000);
        }, [bioPlaceholder])
    );

    useFocusEffect(
        React.useCallback(() => {
            const uid = getAuth().currentUser?.uid;
            if (uid) {
                ProfileController.getProfile(uid, (userProfile: UserProfileModel) => {
                    setUserProfile(userProfile);

                    if (userProfile?.photoUrl) setPhotoUrl(userProfile.photoUrl);
                    if (userProfile?.username) setUsername(userProfile.username);
                    if (userProfile?.name) setDisplayName(userProfile.name);
                    if (userProfile?.location) setLocation(userProfile.location);
                    if (userProfile?.bio) setBio(userProfile.bio);
                });
            }
        }, [])
    );

    return (
        <Screen>
            <Banner name={"Edit Profile"} leftIcon={"arrow-back"} leftRoute={"BACK"} />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }} >
                <View style={{ height: "100%", width: "100%" }}>
                    <KeyboardAvoidingView style={{ height: "100%" }} keyboardVerticalOffset={isIosApp() ? -10 : 111} behavior={isIosApp() ? 'padding' : 'height'}>

                        <View style={{ paddingTop: 15, width: "100%", alignItems: "center" }}>
                            <Image style={{ width: 100, height: 100, borderRadius: 50 }} source={{ uri: photoUrl }} />
                            <View style={{ paddingTop: 3 }}>
                                <Text style={{ fontSize: 12 }} onPress={() => { alert("coming soon!") }}>Change Photo</Text>
                            </View>
                        </View>

                        {/* Username */}
                        <View style={{ paddingTop: 10, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, paddingTop: 15, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Username</Text>
                            <TextInput
                                style={{ padding: 15, fontFamily: "Poppins_400Regular", color: colors.goal_primary_font, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, width: "95%" }}
                                placeholder={"Username"}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setUsername}
                                value={username}
                                autoCorrect={false}
                            />
                        </View>

                        {/* Display Name */}
                        <View style={{ paddingTop: 10, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, paddingTop: 15, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Display Name</Text>
                            <TextInput
                                style={{ padding: 15, fontFamily: "Poppins_400Regular", color: colors.goal_primary_font, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, width: "95%" }}
                                placeholder={"Display Name"}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setDisplayName}
                                value={displayName}
                                autoCorrect={true}
                            />
                        </View>

                        {/* Location */}
                        <View style={{ paddingTop: 10, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, paddingTop: 15, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Location</Text>
                            <TextInput
                                style={{ padding: 15, fontFamily: "Poppins_400Regular", color: colors.goal_primary_font, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, width: "95%" }}
                                placeholder={"where in the world?"}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setLocation}
                                value={location}
                                autoCorrect={true}
                            />
                        </View>

                        {/* Bio */}
                        <View style={{ paddingTop: 15, alignItems: "center" }}>
                            <Text onPress={() => { Keyboard.dismiss() }} style={{ color: colors.goal_primary_font, paddingLeft: 5, width: "95%", paddingBottom: 10, fontFamily: "Poppins_400Regular" }}>Bio</Text>
                            <TextInput
                                textAlignVertical='top'
                                style={{ width: "95%", fontFamily: "Poppins_400Regular", height: 200, borderRadius: 12, backgroundColor: colors.text_input_background, borderColor: colors.text_input_border, borderWidth: 1, color: colors.text, paddingTop: 10, paddingLeft: 10, paddingRight: 10 }}
                                multiline={true}
                                placeholder={bioPlaceholder}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setBio}
                                value={bio}
                                autoCorrect={true}
                            />
                        </View>

                        <View style={{ zIndex: -1, flex: 1, alignItems: 'center', justifyContent: 'flex-end', alignSelf: 'stretch', margin: 5, paddingBottom: 15 }}>
                            <View style={{ width: "95%" }}>
                                <EmbtrButton buttonText={'Update Profile'} callback={() => {
                                    if (userProfile) {
                                        userProfile.username = username;
                                        userProfile.name = displayName;
                                        userProfile.location = location;
                                        userProfile.bio = bio;
                                        ProfileController.updateProfile(userProfile);
                                    }
                                    navigation.navigate("Profile");
                                }} />
                            </View>
                        </View>
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </Screen>
    );
};