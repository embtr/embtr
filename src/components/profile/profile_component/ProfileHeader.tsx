import { Image, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CachedImage } from 'src/components/common/images/CachedImage';
import DEFAULT from 'assets/banner.png';
import { getWindowWidth } from 'src/util/GeneralUtility';
import React from 'react';
import { User } from 'resources/schema';
import { PADDING_LARGE, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';
import { ThemeDefaultImage } from './ThemeDefaultImage';

interface Props {
    user: User;
    setHeight: Function;
}

export const ProfileHeader = ({ user, setHeight }: Props) => {
    const { colors } = useTheme();

    const width = getWindowWidth() * 0.95;
    const height = width * 0.33;

    return (
        <View style={{ padding: PADDING_LARGE, paddingBottom: 0 }}>
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
                    <ThemeDefaultImage />
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
                            style={{ width: '100%', height: '100%', borderRadius: 1000 }}
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
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontFamily: POPPINS_MEDIUM,
                                    color: colors.profile_name_text,
                                }}
                            >
                                {user.displayName}
                            </Text>
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
                                fontFamily: POPPINS_MEDIUM,
                                color: colors.secondary_text,
                            }}
                        >
                            {'@' + user.username}
                        </Text>
                        <View
                            style={{
                                justifyContent: 'center',
                            }}
                        >
                            <Ionicons name={'location-outline'} size={12} color={colors.link} />
                        </View>
                        <Text
                            style={{
                                fontSize: 12,
                                includeFontPadding: false,
                                fontFamily: POPPINS_MEDIUM,
                                color: colors.secondary_text,
                            }}
                        >
                            {user.location}
                        </Text>
                    </View>

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
                </View>
            </View>
        </View>
    );
};
