import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { ImageUtility } from 'src/util/images/ImageUtility';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { InteractableData } from 'src/components/timeline/interactable/InteractableElementCustomHooks';
import { FeaturedPost } from 'resources/schema';
import { CarouselCards, ImageCarouselImage } from 'src/components/common/images/ImageCarousel';
import { CardHeader } from '../card_components/CardHeader';
import PostDetailsActionBar from 'src/components/common/comments/PostDetailsActionBar';

interface Props {
    featuredPost: FeaturedPost;
    interactableData: InteractableData;
}

export const FeaturedPostElement = ({ featuredPost, interactableData }: Props) => {
    const { colors } = useTheme();

    if (!featuredPost.createdAt) {
        return null;
    }

    const sortDate = featuredPost.createdAt;
    const padding = PADDING_LARGE;

    let carouselImages: ImageCarouselImage[] = ImageUtility.createReadOnlyCarouselImages(
        featuredPost.images ?? []
    );

    return (
        <View
            style={[
                {
                    backgroundColor: colors.card_background,
                    borderRadius: 9,
                    padding: PADDING_LARGE,
                },
                CARD_SHADOW,
            ]}
        >
            {/**********/}
            {/* HEADER */}
            {/**********/}
            <CardHeader
                date={sortDate}
                header={featuredPost.title}
                subHeader={featuredPost.subtitle}
                type={TimelineElementType.USER_FEATURED_POST}
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
            {featuredPost.body && (
                <View style={{ paddingTop: padding }}>
                    <Text
                        style={{
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 13,
                            color: colors.text,
                        }}
                    >
                        {featuredPost.body}
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
                        isCurrentUser={false}
                    />
                </View>
            </View>
        </View>
    );
};
