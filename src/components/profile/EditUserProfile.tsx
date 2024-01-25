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
import { useNavigation } from '@react-navigation/native';
import { ProfileTabScreens } from 'src/navigation/RootStackParamList';
import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';
import ProfileBannerImage from 'src/components/profile/profile_component/ProfileBannerImage';
import { Ionicons } from '@expo/vector-icons';
import { BannerInfoModal } from 'src/components/profile/profile_component/BannerInfoModal';
import { CachedImage } from '../common/images/CachedImage';
import { getRandomInt } from 'src/util/GeneralUtility';
import UserController, { UserCustomHooks } from 'src/controller/user/UserController';
import { POPPINS_REGULAR } from 'src/util/constants';
import { UserService, UsernameAvailabilityResult } from 'src/service/UserService';
import { Code } from 'resources/codes';
import { User } from 'resources/schema';
import { isIosApp } from 'src/util/DeviceUtil';
import { EmbtrKeyboardAvoidingScrollView } from 'src/components/common/scrollview/EmbtrKeyboardAvoidingScrollView';

const placeholderOptions: string[] = [
    'I love pringles <3',
    'Smarter than your average',
    'Do people read these?',
    'Top 10 Horseshoe player on my street.',
    'Work Hard, Train Harder.',
];

const _maybeRenderUploadingOverlay = (imageUploading: boolean) => {
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

export const EditUserProfile = () => {
    const { colors } = useTheme();
    const bioPlaceholder = placeholderOptions[getRandomInt(0, placeholderOptions.length - 1)];
    const navigation = useNavigation<StackNavigationProp<ProfileTabScreens>>();

    const currentUser = UserCustomHooks.useCurrentUser();

    const [updatedUser, setUpdatedUser] = React.useState<User | undefined>(undefined);
    const [imageUploading, setImageUploading] = React.useState(false);
    const [showBannerInfoModal, setShowBannerInfoModal] = React.useState(false);
    const [usernameAvailabilityResult, setUsernameAvailabilityResult] =
        React.useState<UsernameAvailabilityResult>({ message: 'available', available: true });

    const displayBannerInfoModal = () => {
        setShowBannerInfoModal(true);
    };

    const hideBannerInfoModal = () => {
        setShowBannerInfoModal(false);
    };

    React.useEffect(() => {
        if (!currentUser.data) {
            return;
        }

        setUpdatedUser({ ...currentUser.data });
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

        setUsernameAvailabilityResult(usernameAvailabilityResult);
    };

    const setUsernameWrapper = async (username: string) => {
        if (!UserService.usernameIsValid(username)) {
            return;
        }

        setUsernameAvailability(username);
        setUpdatedUser({ ...updatedUser, username });
    };

    const uploadProfilePhoto = async () => {
        setImageUploading(true);
        const url = await UserController.uploadProfilePhoto();
        if (url) {
            setUpdatedUser({ ...updatedUser, photoUrl: url });
        }
        setImageUploading(false);
    };

    const uploadProfileBanner = async () => {
        setImageUploading(true);
        const url = await UserController.uploadProfileBanner();
        if (url) {
            setUpdatedUser({ ...updatedUser, bannerUrl: url });
        }
        setImageUploading(false);
    };

    const saveProfile = async () => {
        if (!updatedUser) {
            return;
        }

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
            {_maybeRenderUploadingOverlay(imageUploading)}
            <BannerInfoModal visible={showBannerInfoModal} dismiss={hideBannerInfoModal} />

            <View style={{ flex: 1 }}>
                <EmbtrKeyboardAvoidingScrollView
                    header={
                        <Banner
                            name={'Edit Profile'}
                            leftText="cancel"
                            leftRoute={'BACK'}
                            rightText="save"
                            rightColor={
                                usernameAvailabilityResult.available
                                    ? colors.link
                                    : colors.secondary_text
                            }
                            rightOnClick={saveProfile}
                            rightEnabled={usernameAvailabilityResult.available}
                        />
                    }
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
                                <ProfileBannerImage sourceUrl={updatedUser?.bannerUrl ?? ''} />
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
                                        {updatedUser?.photoUrl && (
                                            <CachedImage
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    borderRadius: 50,
                                                }}
                                                uri={updatedUser.photoUrl}
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
                                value={updatedUser?.username}
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
                            onChangeText={(displayName) =>
                                setUpdatedUser({ ...updatedUser, displayName })
                            }
                            value={updatedUser?.displayName}
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
                            onChangeText={(text) => {
                                setUpdatedUser({ ...updatedUser, location: text });
                            }}
                            value={updatedUser?.location}
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
                            scrollEnabled={false}
                            placeholder={bioPlaceholder}
                            placeholderTextColor={colors.secondary_text}
                            onChangeText={(text) => {
                                setUpdatedUser({ ...updatedUser, bio: text });
                            }}
                            value={updatedUser?.bio}
                            autoCorrect={true}
                        />
                    </View>

                    <View
                        style={{
                            height: 15,
                        }}
                    />
                </EmbtrKeyboardAvoidingScrollView>
            </View>
        </Screen>
    );
};
