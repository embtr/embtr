import React from 'react';
import {
    View,
    Text,
    TextInput,
    Keyboard,
    KeyboardAvoidingView,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { ProfileTabScreens } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { isIosApp } from 'src/util/DeviceUtil';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileBannerImage from 'src/components/profile/profile_component/ProfileBannerImage';
import { Ionicons } from '@expo/vector-icons';
import { BannerInfoModal } from 'src/components/profile/profile_component/BannerInfoModal';
import { CachedImage } from '../common/images/CachedImage';
import { getRandomInt } from 'src/util/GeneralUtility';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';
import { UpdateUserRequest } from 'resources/types/requests/UserTypes';
import { POPPINS_REGULAR } from 'src/util/constants';
import { UserService, UsernameAvailabilityResult } from 'src/service/UserService';
import { Code } from 'resources/codes';

const placeholderOptions: string[] = [
    'I love pringles <3',
    'Smarter than your average',
    'Do people read these?',
    'Top 10 Horseshoe player on my street.',
    'Work Hard, Train Harder.',
];

export const EditUserProfile = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<ProfileTabScreens>>();

    const [photoUrl, setPhotoUrl] = React.useState('');
    const [bannerUrl, setBannerUrl] = React.useState('');
    const [username, setUsername] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');
    const [location, setLocation] = React.useState('');
    const [bio, setBio] = React.useState('');
    const [imageUploading, setImageUploading] = React.useState(false);
    const [showBannerInfoModal, setShowBannerInfoModal] = React.useState(false);
    const [bioPlaceholder, setBioPlaceholder] = React.useState<string>(
        placeholderOptions[getRandomInt(0, placeholderOptions.length - 1)]
    );

    const [usernameAvailabilityResult, setUsernameAvailabilityResult] =
        React.useState<UsernameAvailabilityResult>({ message: 'available', available: true });

    const currentUser = UserCustomHooks.useCurrentUser();

    const displayBannerInfoModal = () => {
        setShowBannerInfoModal(true);
    };

    const hideBannerInfoModal = () => {
        setShowBannerInfoModal(false);
    };

    useFocusEffect(
        React.useCallback(() => {
            setTimeout(() => {
                let x = -1;
                while (x === -1) {
                    let newIndex = getRandomInt(0, placeholderOptions.length - 1);
                    if (placeholderOptions[newIndex] !== bioPlaceholder) {
                        x = newIndex;
                    }
                }
                setBioPlaceholder(placeholderOptions[x]);
            }, 6000);
        }, [bioPlaceholder])
    );

    React.useEffect(() => {
        if (!currentUser.data) {
            return;
        }

        setPhotoUrl(currentUser.data.photoUrl ?? '');
        setBannerUrl(currentUser.data.bannerUrl ?? '');
        setUsername(currentUser.data.username ?? '');
        setDisplayName(currentUser.data.displayName ?? '');
        setLocation(currentUser.data.location ?? '');
        setBio(currentUser.data.bio ?? '');
    }, [currentUser.data]);

    const setUsernameAvailability = async (targetUsername: string) => {
        if (!currentUser.data?.username) {
            setUsernameAvailabilityResult({ message: 'loading', available: false });
            return;
        }

        const currentUsername = currentUser.data.username;

        const usernameAvailabilityResult = await UserService.usernameIsAvailable(
            targetUsername,
            currentUsername
        );
        console.log(usernameAvailabilityResult);
        setUsernameAvailabilityResult(usernameAvailabilityResult);
    };

    const setUsernameWrapper = async (username: string) => {
        if (!UserService.usernameIsValid(username)) {
            return;
        }

        setUsernameAvailability(username);
        setUsername(username);
    };

    const uploadProfilePhoto = async () => {
        setImageUploading(true);
        const url = await UserController.uploadProfilePhoto();
        if (url) {
            setPhotoUrl(url);
        }
        setImageUploading(false);
    };

    const uploadProfileBanner = async () => {
        setImageUploading(true);
        const url = await UserController.uploadProfileBanner();
        if (url) {
            setBannerUrl(url);
        }
        setImageUploading(false);
    };

    let _maybeRenderUploadingOverlay = () => {
        if (imageUploading) {
            return (
                <View
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            zIndex: 3,
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            alignItems: 'center',
                            justifyContent: 'center',
                        },
                    ]}
                >
                    <ActivityIndicator color="#fff" animating size="large" />
                </View>
            );
        }
    };

    const saveProfile = async () => {
        if (!currentUser.data) {
            return;
        }

        const updatedUser: UpdateUserRequest = {
            ...currentUser.data,
            photoUrl,
            bannerUrl,
            username,
            displayName,
            location,
            bio,
        };

        const updateUserResponse = await UserController.setup(updatedUser);
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

    return (
        <Screen>
            <Banner
                name={'Edit Profile'}
                leftText="cancel"
                leftRoute={'BACK'}
                rightText="save"
                rightColor={
                    usernameAvailabilityResult.available ? colors.link : colors.secondary_text
                }
                rightOnClick={saveProfile}
                rightEnabled={usernameAvailabilityResult.available}
            />

            {_maybeRenderUploadingOverlay()}
            <BannerInfoModal visible={showBannerInfoModal} dismiss={hideBannerInfoModal} />

            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={{ height: '100%', width: '100%' }}>
                    <KeyboardAvoidingView
                        style={{ height: '100%' }}
                        keyboardVerticalOffset={isIosApp() ? -10 : 111}
                        behavior={isIosApp() ? 'padding' : 'height'}
                    >
                        <TouchableWithoutFeedback onPress={uploadProfileBanner}>
                            <View
                                style={{
                                    width: '100%',
                                    height: 180,
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <View
                                    style={{
                                        zIndex: 3,
                                        position: 'absolute',
                                        alignItems: 'flex-end',
                                        justifyContent: 'flex-end',
                                        paddingBottom: 40,
                                        paddingRight: 20,
                                    }}
                                >
                                    <View
                                        style={{
                                            borderRadius: 50,
                                            backgroundColor: colors.text,
                                            height: 21,
                                            width: 21,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Ionicons
                                            name={'information-circle-outline'}
                                            size={22}
                                            color={colors.background}
                                            onPress={displayBannerInfoModal}
                                        />
                                    </View>
                                </View>
                                <View
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        alignItems: 'center',
                                        paddingTop: 10,
                                    }}
                                >
                                    <ProfileBannerImage sourceUrl={bannerUrl} />
                                </View>

                                <View
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        position: 'absolute',
                                        zIndex: 2,
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <TouchableOpacity onPress={uploadProfilePhoto}>
                                        <View
                                            style={{
                                                alignItems: 'flex-end',
                                                justifyContent: 'flex-end',
                                            }}
                                        >
                                            {photoUrl && (
                                                <CachedImage
                                                    style={{
                                                        width: 100,
                                                        height: 100,
                                                        borderRadius: 50,
                                                    }}
                                                    uri={photoUrl}
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                        {/* Username */}
                        <View style={{ paddingTop: 10, alignItems: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    color: colors.goal_primary_font,
                                    paddingTop: 15,
                                    paddingLeft: 5,
                                    width: '95%',
                                    paddingBottom: 10,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                Username
                            </Text>
                            <View style={{ width: '95%' }}>
                                <Text
                                    style={{
                                        color: usernameAvailabilityResult.available
                                            ? colors.progress_bar_complete
                                            : colors.error,
                                        fontSize: 12,
                                        position: 'absolute',
                                        zIndex: 2,
                                        right: 4,
                                        bottom: 3,
                                    }}
                                >
                                    {usernameAvailabilityResult.message}
                                </Text>
                                <TextInput
                                    style={{
                                        padding: 15,
                                        fontFamily: 'Poppins_400Regular',
                                        color: colors.goal_primary_font,
                                        borderRadius: 12,
                                        backgroundColor: colors.text_input_background,
                                        borderColor: colors.text_input_border,
                                        borderWidth: 1,
                                        width: '100%',
                                    }}
                                    placeholder={'Username'}
                                    placeholderTextColor={colors.secondary_text}
                                    onChangeText={setUsernameWrapper}
                                    value={username}
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Display Name */}
                        <View style={{ paddingTop: 10, alignItems: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    color: colors.goal_primary_font,
                                    paddingTop: 15,
                                    paddingLeft: 5,
                                    width: '95%',
                                    paddingBottom: 10,
                                    fontFamily: 'Poppins_400Regular',
                                }}
                            >
                                Display Name
                            </Text>
                            <TextInput
                                style={{
                                    padding: 15,
                                    fontFamily: 'Poppins_400Regular',
                                    color: colors.goal_primary_font,
                                    borderRadius: 12,
                                    backgroundColor: colors.text_input_background,
                                    borderColor: colors.text_input_border,
                                    borderWidth: 1,
                                    width: '95%',
                                }}
                                placeholder={'Display Name'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setDisplayName}
                                value={displayName}
                                autoCorrect={true}
                            />
                        </View>

                        {/* Location */}
                        <View style={{ paddingTop: 10, alignItems: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    color: colors.goal_primary_font,
                                    paddingTop: 15,
                                    paddingLeft: 5,
                                    width: '95%',
                                    paddingBottom: 10,
                                    fontFamily: 'Poppins_400Regular',
                                }}
                            >
                                Location
                            </Text>
                            <TextInput
                                style={{
                                    padding: 15,
                                    fontFamily: 'Poppins_400Regular',
                                    color: colors.goal_primary_font,
                                    borderRadius: 12,
                                    backgroundColor: colors.text_input_background,
                                    borderColor: colors.text_input_border,
                                    borderWidth: 1,
                                    width: '95%',
                                }}
                                placeholder={'where in the world?'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setLocation}
                                value={location}
                                autoCorrect={true}
                            />
                        </View>

                        {/* Bio */}
                        <View style={{ paddingTop: 15, alignItems: 'center' }}>
                            <Text
                                onPress={() => {
                                    Keyboard.dismiss();
                                }}
                                style={{
                                    color: colors.goal_primary_font,
                                    paddingLeft: 5,
                                    width: '95%',
                                    paddingBottom: 10,
                                    fontFamily: 'Poppins_400Regular',
                                }}
                            >
                                Bio
                            </Text>
                            <TextInput
                                textAlignVertical="top"
                                style={{
                                    width: '95%',
                                    fontFamily: 'Poppins_400Regular',
                                    height: 200,
                                    borderRadius: 12,
                                    backgroundColor: colors.text_input_background,
                                    borderColor: colors.text_input_border,
                                    borderWidth: 1,
                                    color: colors.text,
                                    paddingTop: 10,
                                    paddingLeft: 10,
                                    paddingRight: 10,
                                }}
                                multiline={true}
                                placeholder={bioPlaceholder}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setBio}
                                value={bio}
                                autoCorrect={true}
                            />
                        </View>

                        <View
                            style={{
                                height: 15,
                            }}
                        />
                    </KeyboardAvoidingView>
                </View>
            </ScrollView>
        </Screen>
    );
};
