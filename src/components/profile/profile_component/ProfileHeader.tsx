import { Image, LayoutChangeEvent, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CachedImage } from 'src/components/common/images/CachedImage';
import DEFAULT from 'assets/banner.png';
import { getWindowWidth } from 'src/util/GeneralUtility';
import React from 'react';
import { User } from 'resources/schema';
import { HorizontalLine } from 'src/components/common/HorizontalLine';

interface Props {
    user: User;
    setHeight: Function;
}

export const ProfileHeader = ({ user, setHeight }: Props) => {
    const { colors } = useTheme();
    const [initialHeaderContentsHeight, setInitialHeaderContentsHeight] = React.useState<number>(0);

    const width = getWindowWidth() * 0.95;
    const height = width * 0.33;
    const PROFILE_PHOTO_OVERLAP = 65;

    const storeInitialHeaderContentsHeight = (event: LayoutChangeEvent) => {
        setInitialHeaderContentsHeight(event.nativeEvent.layout.height);
    };

    return (
        <View
            onLayout={(e) => {
                setHeight(e.nativeEvent.layout.height);
            }}
            style={{
                paddingLeft: 10,
                paddingRight: 10,
                paddingTop: 10,
                marginBottom: PROFILE_PHOTO_OVERLAP * -1,
            }}
        >
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
                        uri={user.bannerUrl}
                    />
                ) : (
                    <Image
                        source={DEFAULT}
                        style={{
                            width: '100%',
                            height: '100%',
                            maxHeight: 135,
                            borderRadius: 15,
                        }}
                    />
                )}
            </View>

            {/* PROFILE PHOTO */}

            <View
                style={{
                    alignItems: 'center',
                    bottom: PROFILE_PHOTO_OVERLAP,
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
                    onLayout={
                        initialHeaderContentsHeight === 0
                            ? storeInitialHeaderContentsHeight
                            : undefined
                    }
                    style={[{ overflow: 'hidden', width: '100%', alignItems: 'center' }]}
                >
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View
                            style={{
                                flex: 1,
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontFamily: 'Poppins_600SemiBold',
                                    color: colors.profile_name_text,
                                }}
                            >
                                {user.displayName}
                            </Text>
                        </View>
                    </View>
                    <Text
                        style={{
                            fontSize: 10,
                            fontFamily: 'Poppins_500Medium',
                            color: colors.profile_bio_text,
                        }}
                    >
                        {user.location}
                    </Text>

                    <Text
                        style={{
                            fontSize: 12,
                            fontFamily: 'Poppins_500Medium',
                            color: colors.profile_bio_text,
                            paddingTop: 3,
                        }}
                    >
                        {user.bio}
                    </Text>
                </View>

                <View style={{ paddingTop: 5, width: '100%' }}>
                    <HorizontalLine />
                </View>
            </View>

            <View style={{ height: 10 }} />
        </View>
    );
};
