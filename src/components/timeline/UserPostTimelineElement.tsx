import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { ImageUtility } from 'src/util/images/ImageUtility';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';
import { CardHeader } from './card_components/CardHeader';
import StoryController, { StoryCustomHooks } from 'src/controller/timeline/story/StoryController';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import React from 'react';
import { UserPost } from 'resources/schema';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import USER_POST_DETAILS = Routes.USER_POST_DETAILS;

interface Props {
    initialUserPost: UserPost;
}

export const UserPostTimelineElement = ({ initialUserPost }: Props) => {
    const { colors } = useTheme();

    const navigation = useEmbtrNavigation();
    const [modified, setModified] = React.useState(false);

    const idToUse = !modified ? 0 : initialUserPost.id;
    const updatedUserPost = StoryCustomHooks.useStory(idToUse);
    const userPost = updatedUserPost.data ?? initialUserPost;

    const currentUser = useAppSelector(getCurrentUser);

    if (!userPost.createdAt || !userPost.user) {
        return <View />;
    }

    const likeCount = userPost.likes?.length ?? 0;
    const commentCount = userPost.comments?.length ?? 0;
    const isLiked = userPost.likes?.some((like) => like.userId === currentUser.id) ?? false;

    const sortDate = userPost.createdAt;
    const user = userPost.user;
    const secondaryHeader = 'secondary header';

    const handleOnLike = async () => {
        if (isLiked || !userPost.id) {
            return;
        }

        await StoryController.addLikeViaApi(userPost.id);
        StoryController.invalidate(userPost.id);
        setModified(true);
    };

    let carouselImages: ImageCarouselImage[] = ImageUtility.createReadOnlyCarouselImages(
        userPost.images ?? []
    );

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                if (!userPost.id) {
                    return;
                }

                navigation.navigate(USER_POST_DETAILS, {
                    id: userPost.id,
                });
            }}
        >
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
                            numberOfLines={3}
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
                            isLiked={isLiked}
                            likeCount={likeCount}
                            commentCount={commentCount}
                            onLike={handleOnLike}
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
