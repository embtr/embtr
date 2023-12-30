import React from 'react';

import {
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { CachedImage } from 'src/components/common/images/CachedImage';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { MasterScreens } from 'src/navigation/RootStackParamList';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';
import { Code } from 'resources/codes';
import { UserService, UsernameAvailabilityResult } from 'src/service/UserService';

/*
 * Title -> Introduction -> Username / handle -> Shown Name ->
 * About yourself -> Age -> Location ->(Next page) Add a photo of
 * yourself -> (Next page) -> Find your friends (when we have that option) ->
 *  (Next page) -> Set up your first habit
 */

const PROFILE_IMAGE =
    'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/common%2Fdefault_profile.png?alt=media';

const PADDING = TIMELINE_CARD_PADDING * 0.6;

export const NewUserProfilePopulation = () => {
    const { colors } = useTheme();

    const [imageHeight, setImageHeight] = React.useState(0);
    const [imageUploading, setImageUploading] = React.useState(false);

    const [username, setUsername] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [userProfileUrl, setUserProfileUrl] = React.useState(PROFILE_IMAGE);
    const [usernameAvailabilityResult, setUsernameAvailabilityResult] =
        React.useState<UsernameAvailabilityResult>({ message: 'available', available: true });

    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();

    const currentUser = UserCustomHooks.useCurrentUser();
    React.useEffect(() => {
        if (currentUser.data) {
            if (currentUser.data.username?.length && currentUser.data.username !== 'new user') {
                setUsername(currentUser.data.username);
            }

            if (
                currentUser.data.displayName?.length &&
                currentUser.data.displayName !== 'new user'
            ) {
                setDisplayName(currentUser.data.displayName);
            }

            if (currentUser.data.bio?.length && currentUser.data.bio !== 'welcome to embtr!') {
                setBio(currentUser.data.bio);
            }

            if (currentUser.data.photoUrl?.length && currentUser.data.photoUrl) {
                setUserProfileUrl(currentUser.data.photoUrl);
            }

            let usernameToValidate = currentUser.data.username?.length
                ? currentUser.data.username
                : '';
            if (usernameToValidate === 'new user') {
                usernameToValidate = '';
            }

            setUsernameAvailability(usernameToValidate);
        }
    }, [currentUser.data]);

    const uploadProfilePhoto = async () => {
        setImageUploading(true);
        const url = await UserController.uploadProfilePhoto();
        if (url) {
            setUserProfileUrl(url);
        }
        setImageUploading(false);
    };

    const submitProfileData = async () => {
        const userClone = { ...currentUser.data };
        userClone.username = username;
        userClone.displayName = displayName;
        userClone.bio = bio;
        userClone.photoUrl = userProfileUrl;

        const updateUserResponse = await UserController.setup(userClone);
        if (updateUserResponse === undefined) {
            setUsernameAvailabilityResult({
                message: 'an error occurred',
                available: false,
            });
        } else if (updateUserResponse.internalCode === Code.USERNAME_IN_USE) {
            setUsernameAvailabilityResult({
                message: 'username in use',
                available: false,
            });
        } else if (updateUserResponse.internalCode !== Code.SUCCESS) {
            setUsernameAvailabilityResult({
                message: 'an error occurred',
                available: false,
            });
        } else {
            await UserController.invalidateCurrentUser();
            navigation.popToTop();
        }
    };

    const setUsernameAvailability = async (targetUsername: string) => {
        if (!currentUser.data?.username) {
            setUsernameAvailabilityResult({ message: 'loading', available: false });
            return;
        }

        const currentUsername = currentUser.data.username;

        const usernameAvailabilityResult = await UserService.usernameIsAvailable(
            currentUsername,
            targetUsername
        );
        setUsernameAvailabilityResult(usernameAvailabilityResult);
    };

    const setUsernameWrapper = async (username: string) => {
        if (!UserService.usernameIsValid(username)) {
            return;
        }

        setUsernameAvailability(username);
        setUsername(username);
    };

    return (
        <Pressable
            style={{ flex: 1, backgroundColor: colors.background }}
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <KeyboardAvoidingView behavior={'position'} keyboardVerticalOffset={100}>
                <View style={{ height: TIMELINE_CARD_PADDING * 2 }} />
                <View style={{ alignItems: 'center', paddingTop: TIMELINE_CARD_PADDING * 2 }}>
                    <Image
                        source={require('assets/logo.png')}
                        style={{ width: 150, height: 150 }}
                    />
                </View>
                <Text
                    style={{
                        paddingTop: TIMELINE_CARD_PADDING,
                        color: colors.text,
                        textAlign: 'center',
                        fontSize: 24,
                        paddingBottom: TIMELINE_CARD_PADDING,
                        fontFamily: POPPINS_MEDIUM,
                    }}
                >
                    Welcome to embtr!
                </Text>

                <Text
                    style={{
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                        paddingHorizontal: TIMELINE_CARD_PADDING,
                        fontSize: 14,
                    }}
                >
                    We're so glad that you're here. Before we start, tell us a little bit about
                    yourself!
                </Text>

                <View style={{ height: TIMELINE_CARD_PADDING * 4 }} />
                <View style={{ alignItems: 'center', paddingHorizontal: TIMELINE_CARD_PADDING }}>
                    <View
                        style={{
                            backgroundColor: colors.timeline_card_background,
                            height: getWindowHeight() / 4,
                            width: '100%',
                            borderRadius: 10,
                            padding: PADDING,
                        }}
                    >
                        <View
                            style={{ flex: 1, flexDirection: 'row' }}
                            onLayout={(e) => {
                                setImageHeight(e.nativeEvent.layout.height);
                            }}
                        >
                            <View>
                                <TouchableOpacity onPress={uploadProfilePhoto}>
                                    <View>
                                        <CachedImage
                                            style={{
                                                width: imageHeight,
                                                height: imageHeight,
                                                borderRadius: 50,
                                            }}
                                            uri={userProfileUrl}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    paddingLeft: PADDING,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={{
                                            color: colors.text,
                                            backgroundColor: colors.text_input_background,
                                            padding: TIMELINE_CARD_PADDING,
                                            flex: 1,
                                            borderRadius: 5,
                                        }}
                                        placeholder={'username'}
                                        placeholderTextColor={colors.secondary_text}
                                        autoCapitalize={'none'}
                                        onChangeText={setUsernameWrapper}
                                        value={username}
                                    />
                                    <Text
                                        style={{
                                            color: usernameAvailabilityResult.available
                                                ? colors.progress_bar_complete
                                                : colors.error,
                                            fontSize: 12,
                                            position: 'absolute',
                                            zIndex: 2,
                                            right: 2,
                                            bottom: 1,
                                        }}
                                    >
                                        {usernameAvailabilityResult.message}
                                    </Text>
                                </View>
                                <View style={{ height: PADDING }} />
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={{
                                            color: colors.text,
                                            flex: 1,
                                            backgroundColor: colors.text_input_background,
                                            padding: TIMELINE_CARD_PADDING,
                                            borderRadius: 5,
                                        }}
                                        placeholder={
                                            username.length
                                                ? 'display name (' + username + ')'
                                                : 'display name'
                                        }
                                        placeholderTextColor={colors.secondary_text}
                                        onChangeText={setDisplayName}
                                        value={displayName}
                                    />
                                </View>
                            </View>
                        </View>
                        <View
                            style={{
                                flex: 1,
                            }}
                        >
                            <View style={{ paddingTop: PADDING }}>
                                <TextInput
                                    style={{
                                        color: colors.text,
                                        height: '100%',
                                        width: '100%',
                                        backgroundColor: colors.text_input_background,
                                        padding: TIMELINE_CARD_PADDING,
                                        borderRadius: 5,
                                    }}
                                    textAlignVertical="top"
                                    multiline={true}
                                    placeholder={'what makes you... you?'}
                                    placeholderTextColor={colors.secondary_text}
                                    onChangeText={setBio}
                                    value={bio}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ height: TIMELINE_CARD_PADDING * 2 }} />

                    <TouchableOpacity
                        onPress={async () => {
                            Keyboard.dismiss();
                            await submitProfileData();
                        }}
                        disabled={!usernameAvailabilityResult.available}
                        style={{
                            width: '100%',
                            backgroundColor: usernameAvailabilityResult.available
                                ? colors.accent_color
                                : colors.accent_color_dim,
                            borderRadius: 5,
                        }}
                    >
                        <Text
                            style={{
                                color: usernameAvailabilityResult.available
                                    ? colors.text
                                    : colors.secondary_text,
                                textAlign: 'center',
                                fontFamily: POPPINS_MEDIUM,
                                paddingVertical: TIMELINE_CARD_PADDING / 2,
                            }}
                        >
                            Let's Go!
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Pressable>
    );
};
