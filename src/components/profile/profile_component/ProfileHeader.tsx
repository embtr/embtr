import { Image, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CachedImage } from 'src/components/common/images/CachedImage';
import DEFAULT from 'assets/banner.png';
import { getWindowWidth } from 'src/util/GeneralUtility';
import React from 'react';
import { User } from 'resources/schema';
import {
    PADDING_LARGE,
    PADDING_SMALL,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
} from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';
import { UserPropertyUtil } from 'src/util/UserPropertyUtil';
import { BadgeBelt } from 'src/components/common/badge/BadgeBelt';

interface Props {
    user: User;
    setHeight: Function;
}

export const ProfileHeader = ({ user, setHeight }: Props) => {
    const { colors } = useTheme();

    const userIsAway = UserPropertyUtil.isAway(user);

    const width = getWindowWidth() * 0.95;
    const height = width * 0.33;

    return (
        <View style={{ paddingHorizontal: PADDING_LARGE }}>
            {/* BANNER */}
            <View
                style={[
                    {
                        height: height,
                        alignItems: 'center',
                        justifyContent: 'center',
                    },
                ]}
            >
                {user.bannerUrl ? (
                    <CachedImage
                        style={{ width: '100%', height: '100%', borderRadius: 15 }}
                        uri={user.bannerUrl ?? DEFAULT}
                    />
                ) : (
                    <Image
                        source={DEFAULT}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: 15,
                        }}
                    />
                )}
            </View>

            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    bottom: height * 0.5,
                    marginBottom: -height * 0.5,
                }}
            >
                <View
                    style={{
                        height: height * 0.75,
                        width: height * 0.75,
                    }}
                >
                    {user.photoUrl && (
                        <CachedImage
                            style={{ width: '100%', height: '100%', borderRadius: 50 }}
                            uri={user.photoUrl}
                        />
                    )}
                </View>
                <View
                    style={[
                        {
                            width: '100%',
                            alignItems: 'center',
                        },
                    ]}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                                width: '100%',
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                }}
                            />
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontFamily: POPPINS_MEDIUM,
                                    color: colors.profile_name_text,
                                    includeFontPadding: false,
                                    textAlign: 'center',
                                }}
                            >
                                {user.displayName}
                            </Text>

                            <View
                                style={{
                                    flex: 1,
                                }}
                            >
                                <View
                                    style={{
                                        paddingLeft: PADDING_SMALL / 3,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }}
                                >
                                    <BadgeBelt user={user} size={15} />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 12,
                                includeFontPadding: false,
                                fontFamily: POPPINS_SEMI_BOLD,
                                color: colors.link,
                                bottom: 1,
                            }}
                        >
                            {'@'}
                        </Text>
                        <Text
                            style={{
                                fontSize: 12,
                                includeFontPadding: false,
                                fontFamily: POPPINS_MEDIUM,
                                color: colors.secondary_text,
                            }}
                        >
                            {user.username}
                        </Text>

                        <View style={{ justifyContent: 'center' }}>
                            <Ionicons name={'location-sharp'} size={12} color={colors.link} />
                        </View>
                        <Text
                            style={{
                                right: 1,
                                fontSize: 12,
                                includeFontPadding: false,
                                fontFamily: POPPINS_MEDIUM,
                                color: colors.secondary_text,
                            }}
                        >
                            {user.location}
                        </Text>
                    </View>

                    {user.bio && (
                        <Text
                            style={{
                                fontSize: 12,
                                fontFamily: POPPINS_REGULAR,
                                textAlign: 'center',
                                color: colors.text,
                            }}
                        >
                            {user.bio}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};
