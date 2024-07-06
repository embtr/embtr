import React from 'react';

import {
    ActivityIndicator,
    Image,
    Keyboard,
    Linking,
    Pressable,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, PADDING_LARGE, PADDING_SMALL } from 'src/util/constants';
import { CachedImage } from 'src/components/common/images/CachedImage';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { MasterScreens, Routes } from 'src/navigation/RootStackParamList';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';
import { Code } from 'resources/codes';
import { UserService, UsernameAvailabilityResult } from 'src/service/UserService';
import { Checkbox } from 'src/components/checkbox/Checkbox';
import { MetadataCustomHooks } from 'src/controller/metadata/MetadataController';
import { EmbtrKeyboardAvoidingScrollView } from 'src/components/common/scrollview/EmbtrKeyboardAvoidingScrollView';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getAppleAuthUserInfo, setGlobalLoading } from 'src/redux/user/GlobalState';
import { AppleAuthUserInfo } from 'src/model/GlobalState';
import { UserPropertyController } from 'src/controller/user/UserPropertyController';
import { Constants } from 'resources/types/constants/constants';

/*
 * Title -> Introduction -> Username / handle -> Shown Name ->
 * About yourself -> Age -> Location ->(Next page) Add a photo of
 * yourself -> (Next page) -> Find your friends (when we have that option) ->
 *  (Next page) -> Set up your first habit
 */

const PROFILE_IMAGE =
    'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/common%2Fdefault_profile.png?alt=media';

const PADDING = PADDING_LARGE * 0.6;

const getAppleUsername = (appleAuthUserInfo: AppleAuthUserInfo) => {
    const givenName: string = (appleAuthUserInfo.givenName ?? '').toLowerCase();
    const familyName: string = (appleAuthUserInfo.familyName ?? '').toLowerCase();

    let username = '';
    if (givenName && !familyName) {
        username = givenName;
    } else if (!givenName && familyName) {
        username = familyName;
    } else if (givenName && familyName) {
        username = givenName + '_' + familyName;
    }

    username = username.substring(0, 20);
    return username;
};

export const NewUserProfilePopulation = () => {
    const { colors } = useTheme();

    const [imageHeight, setImageHeight] = React.useState(0);
    const [imageUploading, setImageUploading] = React.useState(false);

    const appleAuthUserInfo = useAppSelector(getAppleAuthUserInfo);
    const defaultUsername = appleAuthUserInfo ? getAppleUsername(appleAuthUserInfo) : '';

    const [username, setUsername] = React.useState(defaultUsername);
    const [displayName, setDisplayName] = React.useState(defaultUsername);
    const [bio, setBio] = React.useState('');
    const [userProfileUrl, setUserProfileUrl] = React.useState(PROFILE_IMAGE);
    const [termsApproved, setTermsApproved] = React.useState(false);
    const [usernameAvailabilityResult, setUsernameAvailabilityResult] =
        React.useState<UsernameAvailabilityResult>({ message: 'available', available: true });

    const navigation = useNavigation<StackNavigationProp<MasterScreens>>();
    const dispatch = useAppDispatch();

    const termsVersion = MetadataCustomHooks.useLatestTermsVersion();
    const currentUser = UserCustomHooks.useCurrentUser();
    React.useEffect(() => {
        if (currentUser.data) {
            if (currentUser.data.username) {
                setUsername(currentUser.data.username);
            }

            if (currentUser.data.displayName) {
                setDisplayName(currentUser.data.displayName);
            }

            if (currentUser.data.bio) {
                setBio(currentUser.data.bio);
            }

            if (currentUser.data.photoUrl) {
                setUserProfileUrl(currentUser.data.photoUrl);
            }

            setUsernameAvailability(currentUser.data.username ?? defaultUsername ?? '');
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
        dispatch(setGlobalLoading(true));

        const terms = termsVersion.data ? Number(termsVersion.data) : 0;
        const userClone = { ...currentUser.data };
        userClone.username = username;
        userClone.displayName = displayName.length > 0 ? displayName : username;
        userClone.bio = bio;
        userClone.photoUrl = userProfileUrl;
        userClone.termsVersion = terms;

        const updateUserResponse = await UserController.setup(userClone);
        if (updateUserResponse === undefined) {
            setUsernameAvailabilityResult({
                message: 'an error occurred',
                available: false,
            });
        } else if (
            updateUserResponse.internalCode === Code.USERNAME_IN_USE ||
            updateUserResponse.internalCode === Code.RESOURCE_ALREADY_EXISTS
        ) {
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
            await UserPropertyController.setTutorialCompletionState(
                Constants.CompletionState.INCOMPLETE
            );
            navigation.navigate(Routes.INTRO_MODAL);
            // move to next page
            //navigation.popToTop();
        }

        dispatch(setGlobalLoading(false));
    };

    const setUsernameAvailability = async (targetUsername: string) => {
        if (!targetUsername || targetUsername.length === 0) {
            setUsernameAvailabilityResult({ message: 'required', available: false });
            return;
        }

        const currentUsername = currentUser.data?.username;

        const usernameAvailabilityResult = await UserService.usernameIsAvailable(
            targetUsername,
            currentUsername
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

    const formValid = !!termsVersion.data && termsApproved && usernameAvailabilityResult.available;

    return (
        <Pressable
            style={{ flex: 1, backgroundColor: colors.background }}
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <EmbtrKeyboardAvoidingScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{ height: PADDING_LARGE * 2 }} />
                    <View style={{ alignItems: 'center', paddingTop: PADDING_LARGE * 2 }}>
                        <Image
                            source={require('assets/logo.png')}
                            style={{ width: 150, height: 150 }}
                        />
                    </View>
                    <Text
                        style={{
                            paddingTop: PADDING_LARGE,
                            color: colors.text,
                            textAlign: 'center',
                            fontSize: 24,
                            paddingBottom: PADDING_LARGE,
                            fontFamily: POPPINS_MEDIUM,
                        }}
                    >
                        Welcome to embtr!
                    </Text>

                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_REGULAR,
                            paddingHorizontal: PADDING_LARGE,
                            textAlign: 'center',
                            fontSize: 14,
                        }}
                    >
                        We're so glad that you're here. Before we start, tell us a little bit about
                        yourself!
                    </Text>

                    <View style={{ height: PADDING_LARGE * 2 }} />
                    <View style={{ alignItems: 'center', paddingHorizontal: PADDING_LARGE }}>
                        <View
                            style={{
                                backgroundColor: colors.card_background,
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
                                                paddingLeft: PADDING_LARGE,
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
                                                paddingLeft: PADDING_LARGE,
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
                                            paddingLeft: PADDING_LARGE,
                                            paddingTop: PADDING_SMALL,
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

                        <View style={{ height: PADDING_LARGE * 2 }} />

                        <View
                            style={{
                                flexDirection: 'row',
                                width: '100%',
                            }}
                        >
                            <Checkbox
                                checked={termsApproved}
                                onCheck={() => {
                                    setTermsApproved(!termsApproved);
                                }}
                            />
                            <View
                                style={{
                                    flex: 1,
                                    paddingLeft: PADDING_LARGE,
                                }}
                            >
                                <Text
                                    style={{
                                        color: colors.secondary_text,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 14,
                                    }}
                                >
                                    By continuing, you agree to our{' '}
                                    <Text
                                        onPress={() => {
                                            Linking.openURL('https://embtr.com/terms');
                                        }}
                                        style={{
                                            color: colors.accent_color,
                                            fontFamily: POPPINS_MEDIUM,
                                        }}
                                    >
                                        Terms of Service
                                    </Text>{' '}
                                    and{' '}
                                    <Text
                                        onPress={() => {
                                            Linking.openURL('https://embtr.com/privacy');
                                        }}
                                        style={{
                                            color: colors.accent_color,
                                            fontFamily: POPPINS_MEDIUM,
                                        }}
                                    >
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </View>
                        </View>

                        <View style={{ height: PADDING_LARGE * 2 }} />

                        <TouchableOpacity
                            onPress={async () => {
                                Keyboard.dismiss();
                                await submitProfileData();
                            }}
                            disabled={!formValid}
                            style={{
                                width: '100%',
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: formValid
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
                                    paddingVertical: PADDING_LARGE / 2,
                                }}
                            >
                                Continue
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ height: PADDING_LARGE * 2 }} />
                </View>
            </EmbtrKeyboardAvoidingScrollView>
        </Pressable>
    );
};
