import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { ImageUtility } from 'src/util/images/ImageUtility';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';
import { CardHeader } from './card_components/CardHeader';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { InteractableData } from 'src/components/timeline/interactable/InteractableElementCustomHooks';
import { UserPost } from 'resources/schema';
import { getCurrentUid } from 'src/session/CurrentUserProvider';

interface Props {
    userPost: UserPost;
    interactableData: InteractableData;
}

export const UserPostElement = ({ userPost, interactableData }: Props) => {
    const { colors } = useTheme();

    if (!userPost.createdAt || !userPost.user) {
        return <View />;
    }

    const sortDate = userPost.createdAt;
    const user = userPost.user;
    const secondaryHeader = user.location;
    const isCurrentUser = getCurrentUid() === user.uid;

    let carouselImages: ImageCarouselImage[] = ImageUtility.createReadOnlyCarouselImages(
        userPost.images ?? []
    );

    return (
        <View
            style={[
                {
                    backgroundColor: colors.card_background,
                    borderRadius: 9,
                    padding: 12,
                },
                CARD_SHADOW,
            ]}
        >
            {/**********/}
            {/* HEADER */}
            {/**********/}
            <CardHeader
                date={sortDate}
                user={user}
                secondaryText={secondaryHeader}
                type={TimelineElementType.USER_POST}
            />

            {/**********/}
            {/* TITLE */}
            {/**********/}
            {userPost.title && (
                <View style={{ paddingTop: 12 }}>
                    <Text
                        style={{
                            fontFamily: POPPINS_SEMI_BOLD,
                            fontSize: 14,
                            color: colors.text,
                        }}
                    >
                        {userPost.title}
                    </Text>
                </View>
            )}

            {/**********/}
            {/*  BODY  */}
            {/**********/}
            {userPost.body && (
                <View style={{ paddingTop: 12 }}>
                    <Text
                        style={{
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 13,
                            color: colors.text,
                        }}
                    >
                        {userPost.body}
                    </Text>
                </View>
            )}

            {/**********/}
            {/* IMAGES */}
            {/**********/}
            {carouselImages.length > 0 && (
                <View
                    style={{
                        paddingTop: 10,
                        alignItems: 'center',
                    }}
                >
                    <CarouselCards images={carouselImages} />
                </View>
            )}

            {/********************/}
            {/*    ACTION BAR    */}
            {/********************/}
            <View style={{ paddingTop: 12 }}>
                <View
                    style={{
                        borderColor: colors.secondary_text,

                        borderTopWidth: StyleSheet.hairlineWidth,
                    }}
                >
                    <View style={{ height: 8 }} />
                    <PostDetailsActionBar
                        interactableData={interactableData}
                        isCurrentUser={isCurrentUser}
                    />
                </View>
            </View>
        </View>
    );
};
