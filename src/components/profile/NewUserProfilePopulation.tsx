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
import React from 'react';
import { CachedImage } from 'src/components/common/images/CachedImage';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { Banner } from '../common/Banner';

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
            <Pressable
                style={{ flex: 1 }}
                onPress={() => {
                    Keyboard.dismiss();
                }}
            >
                <Banner name="" rightText="let's go!" />
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
                <View style={{ height: TIMELINE_CARD_PADDING * 2}} />
                <View style={{ alignItems: 'center', paddingHorizontal: TIMELINE_CARD_PADDING }}>
                    <View
                        style={{
                            backgroundColor: colors.timeline_card_background,
                            height: getWindowHeight() / 4,
                            width: '100%',
                            borderRadius: 12,
                            padding: TIMELINE_CARD_PADDING,
                        }}
                    >
                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <View>
                                <TouchableOpacity onPress={() => {}}>
                                    <View>
                                        <CachedImage
                                            style={{ width: 100, height: 100, borderRadius: 50 }}
                                            uri={PROFILE_IMAGE}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    paddingLeft: TIMELINE_CARD_PADDING / 2,
                                    paddingTop: TIMELINE_CARD_PADDING / 2,
                                }}
                            >
                                <View style={{ flex: 1 }}>
                                    <TextInput
                                        style={{
                                            color: colors.text,
                                            backgroundColor: colors.text_input_background,
                                            padding: TIMELINE_CARD_PADDING,
                                            borderRadius: 5,
                                        }}
                                        placeholder={'username'}
                                        placeholderTextColor={colors.secondary_text}
                                        onChangeText={setUsername}
                                        value={username}
                                    />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <View style={{ height: TIMELINE_CARD_PADDING / 4 }} />
                                    <TextInput
                                        style={{
                                            color: colors.text,
                                            backgroundColor: colors.text_input_background,
                                            padding: TIMELINE_CARD_PADDING,
                                            borderRadius: 5,
                                        }}
                                        placeholder={'display name'}
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
                                paddingTop: TIMELINE_CARD_PADDING,
                            }}
                        >
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
            </Pressable>
        </View>
    );
};
