import { Text, TextStyle, View, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { CARD_SHADOW, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { CarouselCards, ImageCarouselImage } from '../images/ImageCarousel';
import { TouchableWithoutFeedback } from 'react-native';
import { getDatePrettyWithTime } from 'src/util/DateUtility';
import PostDetailsActionBar from '../comments/PostDetailsActionBar';
import { Comment, Like, Image as ImageModel, User } from 'resources/schema';
import React from 'react';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { ImageUtility } from 'src/util/images/ImageUtility';

interface Props {
    staticImage?: ImageSourcePropType;
    user: User;

    added: Date;
    name: string;
    title: string;
    body: string;
    images: ImageModel[];

    likes: Like[];
    onLike: Function;

    comments: Comment[];
    onCommented: Function;

    participants?: number;
    onAccepted?: Function;
    isAccepted?: boolean;
}

export const TextCard = ({
    user,
    staticImage,
    added,
    name,
    title,
    body,
    images,
    likes,
    onLike,
    comments,
    onCommented,
}: Props) => {
    const { colors } = useTheme();

    const currentUser = useAppSelector(getCurrentUser);
    const [isLiked, setIsLiked] = React.useState(
        likes.some((like) => like.userId === currentUser.id)
    );

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

    const bodyTextStyle = {
        fontSize: 12,
        fontFamily: 'Poppins_400Regular',
        color: colors.timeline_card_body,
    } as TextStyle;

    const handleOnLike = () => {
        if (isLiked) {
            return;
        }

        setIsLiked(true);
        onLike();
    };

    const navigateToDetails = () => {
        onCommented();
    };

    const datePretty = getDatePrettyWithTime(added);

    let bodyWithNewLines = body;

    let carouselImages: ImageCarouselImage[] = ImageUtility.createReadOnlyCarouselImages(images);

    return (
        <TouchableWithoutFeedback onPress={navigateToDetails}>
            <View
                style={[
                    {
                        backgroundColor: colors.timeline_card_background,
                        borderRadius: 9,
                    },
                    CARD_SHADOW,
                ]}
            >
                {/**********/}
                {/* HEADER */}
                {/**********/}
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View
                        style={{
                            flex: 1,
                            flexDirection: 'row',
                            paddingTop: TIMELINE_CARD_PADDING,
                            paddingLeft: TIMELINE_CARD_PADDING,
                        }}
                    >
                        <View>
                            {staticImage && (
                                <Image style={{ width: 45, height: 45 }} source={staticImage} />
                            )}
                            {user && <NavigatableUserImage user={user} size={45} />}
                        </View>

                        <View style={{ paddingLeft: 10, flex: 1, alignSelf: 'stretch' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins_600SemiBold',
                                            color: colors.timeline_card_header,
                                        }}
                                    >
                                        {name}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flex: 2,
                                        justifyContent: 'center',
                                        alignItems: 'flex-end',
                                        paddingRight: TIMELINE_CARD_PADDING,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: 'Poppins_400Regular',
                                            fontSize: 12,
                                            opacity: 0.75,
                                            color: colors.timeline_card_header,
                                        }}
                                    >
                                        {datePretty}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                                <Text
                                    style={{
                                        fontFamily: 'Poppins_400Regular',
                                        fontSize: 10,
                                        color: colors.timeline_card_header,
                                    }}
                                >
                                    {user.location}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                <View style={{ paddingTop: 10 }}>
                    <View>
                        <Text style={headerTextStyle}>{title}</Text>
                    </View>

                    <View
                        style={{
                            paddingLeft: TIMELINE_CARD_PADDING,
                            paddingRight: TIMELINE_CARD_PADDING,
                            paddingTop: 10,
                        }}
                    >
                        <Text style={[bodyTextStyle, { textAlign: 'left' }]}>
                            {bodyWithNewLines}
                        </Text>
                        {/* <Text style={[bodyTextStyle, { color: "gray", fontSize: 12, textAlign: "right", marginTop: 5, marginRight: 10 }]}>{"view more..."}</Text> */}
                    </View>
                </View>

                {/**********/}
                {/* PHOTOS */}
                {/**********/}

                {carouselImages.length > 0 && (
                    <View
                        style={{
                            paddingLeft: TIMELINE_CARD_PADDING,
                            paddingRight: TIMELINE_CARD_PADDING,
                            paddingTop: 10,
                        }}
                    >
                        <CarouselCards images={carouselImages} />
                    </View>
                )}

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <PostDetailsActionBar
                    isLiked={isLiked}
                    likeCount={likes.length}
                    commentCount={comments.length}
                    onLike={handleOnLike}
                />
            </View>
        </TouchableWithoutFeedback>
    );
};
