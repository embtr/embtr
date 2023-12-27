import {
    Image,
    KeyboardAvoidingView,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM, POPPINS_REGULAR, TIMELINE_CARD_PADDING } from 'src/util/constants';
import React from 'react';
import { CachedImage } from 'src/components/common/images/CachedImage';
import { isIosApp } from 'src/util/DeviceUtil';

/*
 * Title -> Introduction -> Username / handle -> Shown Name ->
 * About yourself -> Age -> Location ->(Next page) Add a photo of
 * yourself -> (Next page) -> Find your friends (when we have that option) ->
 *  (Next page) -> Set up your first habit
 */

const PROFILE_IMAGE =
    'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/common%2Fdefault_profile.png?alt=media';
export const NewUserProfilePopulation = () => {
    const { colors } = useTheme();
    const [username, setUsername] = React.useState('');
    const [displayName, setDisplayName] = React.useState('');
    const [bio, setBio] = React.useState('');

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>
            <KeyboardAvoidingView
                behavior={'position'}
                keyboardVerticalOffset={isIosApp() ? 25 : -130}
                style={{ flex: 1, backgroundColor: colors.background }}
            >
                <ScrollView
                    style={{
                        backgroundColor: colors.background,
                    }}
                >
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

                    {/* Display Name */}
                    <View
                        style={{
                            paddingTop: TIMELINE_CARD_PADDING,
                            paddingHorizontal: TIMELINE_CARD_PADDING,
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                            }}
                        >
                            <TouchableOpacity onPress={() => {}}>
                                <View
                                    style={{ alignItems: 'flex-end', justifyContent: 'flex-end' }}
                                >
                                    <CachedImage
                                        style={{ width: 100, height: 100, borderRadius: 50 }}
                                        uri={PROFILE_IMAGE}
                                    />
                                </View>
                            </TouchableOpacity>
                            <View>
                                <Text
                                    style={{
                                        color: colors.text,
                                        fontFamily: POPPINS_REGULAR,
                                        paddingTop: TIMELINE_CARD_PADDING / 2,
                                    }}
                                >
                                    Add a photo
                                </Text>
                            </View>
                        </View>

                        <View style={{ marginBottom: TIMELINE_CARD_PADDING }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 17,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                Username
                            </Text>
                            <TextInput
                                style={{
                                    color: colors.text,
                                    backgroundColor: colors.timeline_card_background,
                                    padding: TIMELINE_CARD_PADDING,
                                    borderRadius: 5,
                                }}
                                placeholder={'hotpotato12'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setUsername}
                                value={username}
                            />
                        </View>

                        <View style={{ marginBottom: TIMELINE_CARD_PADDING }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 17,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                Display Name
                            </Text>
                            <TextInput
                                style={{
                                    color: colors.text,
                                    backgroundColor: colors.timeline_card_background,
                                    padding: TIMELINE_CARD_PADDING,
                                    borderRadius: 5,
                                }}
                                placeholder={'Hot Potato 12'}
                                placeholderTextColor={colors.secondary_text}
                                onChangeText={setDisplayName}
                                value={displayName}
                            />
                        </View>

                        <View style={{ marginBottom: 10 }}>
                            <Text
                                style={{
                                    color: colors.text,
                                    fontSize: 17,
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                Bio
                            </Text>
                            <TextInput
                                style={{
                                    color: colors.text,
                                    height: 150,
                                    backgroundColor: '#282828',
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
                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
};
