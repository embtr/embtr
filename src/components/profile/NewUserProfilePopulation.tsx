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

/*
 * Title -> Introduction -> Username / handle -> Shown Name ->
 * About yourself -> Age -> Location ->(Next page) Add a photo of
 * yourself -> (Next page) -> Find your friends (when we have that option) ->
 *  (Next page) -> Set up your first habit
 */

const PROFILE_IMAGE =
    'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/common%2Fdefault_profile.png?alt=media';

const PADDING = TIMELINE_CARD_PADDING * 0.6;

const getUsernameValidationMessage = (username: string) => {
    const empty = username.length === 0;
    if (empty) {
        return 'required';
    }

    const tooShort = username.length < 3;
    if (tooShort) {
        return 'too short';
    }

    const onlyAlphaNumericOrUnderscore = /^[a-zA-Z0-9_]*$/.test(username);
    if (!onlyAlphaNumericOrUnderscore) {
        const invalidCharacterCount = username.replace(/[a-zA-Z0-9_]/g, '').length;
        return invalidCharacterCount === 1 ? 'invalid character' : `invalid characters`;
    }

    return 'available';
};

export const NewUserProfilePopulation = () => {
    const { colors } = useTheme();

    const [imageHeight, setImageHeight] = React.useState(0);

    const [username, setUsername] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');
    const [bio, setBio] = React.useState('');

    const setUsernameWrapper = (username: string) => {
        const onlyAlphaNumericOrUnderscore = /^[a-zA-Z0-9_]*$/.test(username);
        const tooLong = username.length > 20;
        if (onlyAlphaNumericOrUnderscore && !tooLong) {
            setUsername(username);
        }
    };

    const usernameValidationMessage = getUsernameValidationMessage(username);
    const formValid = usernameValidationMessage === 'available';

    return (
        <Pressable
            style={{ flex: 1 }}
            onPress={() => {
                Keyboard.dismiss();
            }}
        >
            <KeyboardAvoidingView
                behavior={'position'}
                keyboardVerticalOffset={100}
                style={{ backgroundColor: colors.background }}
            >
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

                <View style={{ height: TIMELINE_CARD_PADDING * 2 }} />
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
                                <TouchableOpacity onPress={() => {}}>
                                    <View>
                                        <CachedImage
                                            style={{
                                                width: imageHeight,
                                                height: imageHeight,
                                                borderRadius: 50,
                                            }}
                                            uri={PROFILE_IMAGE}
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
                                        onChangeText={setUsernameWrapper}
                                        value={username}
                                    />
                                    <Text
                                        style={{
                                            color: formValid
                                                ? colors.progress_bar_complete
                                                : colors.error,
                                            fontSize: 12,
                                            position: 'absolute',
                                            zIndex: 2,
                                            right: 1,
                                            bottom: 0,
                                        }}
                                    >
                                        {usernameValidationMessage}
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
                                    placeholder={'what makes you, you?'}
                                    placeholderTextColor={colors.secondary_text}
                                    onChangeText={setBio}
                                    value={bio}
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ height: TIMELINE_CARD_PADDING * 2 }} />

                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss();
                        }}
                        disabled={!formValid}
                        style={{
                            width: '100%',
                            backgroundColor: formValid
                                ? colors.accent_color
                                : colors.accent_color_dim,
                            borderRadius: 5,
                        }}
                    >
                        <Text
                            style={{
                                color: formValid ? colors.text : colors.secondary_text,
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
