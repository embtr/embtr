import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { ImageUtility } from 'src/util/images/ImageUtility';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { InteractableData } from 'src/components/timeline/interactable/InteractableElementCustomHooks';
import { UserPost } from 'resources/schema';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { CarouselCards, ImageCarouselImage } from 'src/components/common/images/ImageCarousel';
import { CardHeader } from '../card_components/CardHeader';
import PostDetailsActionBar from 'src/components/common/comments/PostDetailsActionBar';

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
    const padding = PADDING_LARGE * 1.5;

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
            {/* IMAGES */}
            {/**********/}
            {carouselImages.length > 0 && (
                <View
                    style={{
                        paddingTop: padding,
                        alignItems: 'center',
                    }}
                >
                    <CarouselCards images={carouselImages} />
                </View>
            )}

            {/**********/}
            {/*  BODY  */}
            {/**********/}
            {userPost.body && (
                <View style={{ paddingTop: padding }}>
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

            {/********************/}
            {/*    ACTION BAR    */}
            {/********************/}
            <View style={{ paddingTop: padding }}>
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
