import { Text, TextStyle, View, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Timestamp } from 'firebase/firestore';
import { NavigatableUserImage } from 'src/components/profile/NavigatableUserImage';
import { UserProfileModel } from 'src/firebase/firestore/profile/ProfileDao';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { CarouselCards, ImageCarouselImage } from '../images/ImageCarousel';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { getDatePrettyWithTime } from 'src/util/DateUtility';
import PostDetailsActionBar from '../comments/PostDetailsActionBar';
import { Comment, Like } from 'src/controller/timeline/TimelineController';
import LottieView from 'lottie-react-native';
import React from 'react';
import { wait } from 'src/util/GeneralUtility';

interface Props {
    staticImage?: ImageSourcePropType;
    userProfileModel?: UserProfileModel;

    added: Timestamp;
    name: string;
    title: string;
    body: string;
    images: string[];

    likes: Like[];
    onLike: Function;

    comments: Comment[];
    onCommented: Function;

    participants?: number;
    onAccepted?: Function;
    isAccepted?: boolean;
}

export const TextCard = ({ staticImage, userProfileModel, added, name, title, body, images, likes, onLike, comments, onCommented }: Props) => {
    const { colors } = useTheme();

    const animation = React.useRef(null);

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

    const navigateToDetails = () => {
        onCommented();
    };

    let isLiked = false;
    likes.forEach((like) => {
        if (like.uid === userProfileModel?.uid) {
            isLiked = true;
            return;
        }
    });

    const datePretty = getDatePrettyWithTime(added.toDate());

    let bodyWithNewLines = body;

    let carouselImages: ImageCarouselImage[] = [];
    images.forEach((image) => {
        carouselImages.push({
            url: image,
            format: 'png',
            type: 'image',
            onPress: navigateToDetails,
        });
    });

    const handleOnLike = () => {
        animation.current?.play();
        wait(1000).then(() => {
            animation.current?.reset();
        });
        onLike();
    };

    return (
        <TouchableWithoutFeedback onPress={navigateToDetails}>
            <View style={{ backgroundColor: colors.timeline_card_background, borderRadius: 10 }}>
                {/**********/}
                {/* HEADER */}
                {/**********/}
                <View style={{ width: '100%', flexDirection: 'row' }}>
                    <View style={{ flex: 1, flexDirection: 'row', paddingTop: TIMELINE_CARD_PADDING, paddingLeft: TIMELINE_CARD_PADDING }}>
                        <View>
                            {staticImage && <Image style={{ width: 45, height: 45 }} source={staticImage} />}
                            {userProfileModel && <NavigatableUserImage userProfileModel={userProfileModel} size={45} />}
                        </View>

                        <View style={{ paddingLeft: 10, flex: 1, alignSelf: 'stretch' }}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                                    <Text style={{ fontFamily: 'Poppins_600SemiBold', color: colors.timeline_card_header }}>{name}</Text>
                                </View>
                                <View style={{ flex: 2, justifyContent: 'center', alignItems: 'flex-end', paddingRight: TIMELINE_CARD_PADDING }}>
                                    <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 12, opacity: 0.75, color: colors.timeline_card_header }}>
                                        {datePretty}
                                    </Text>
                                </View>
                            </View>

                            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
                                <Text style={{ fontFamily: 'Poppins_400Regular', fontSize: 10, color: colors.timeline_card_header }}>
                                    {userProfileModel?.location}
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

                    <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 10 }}>
                        <Text style={[bodyTextStyle, { textAlign: 'left' }]}>{bodyWithNewLines}</Text>
                        {/* <Text style={[bodyTextStyle, { color: "gray", fontSize: 12, textAlign: "right", marginTop: 5, marginRight: 10 }]}>{"view more..."}</Text> */}
                    </View>
                </View>

                {/**********/}
                {/* PHOTOS */}
                {/**********/}

                {carouselImages.length > 0 && (
                    <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 10 }}>
                        <CarouselCards images={carouselImages} />
                    </View>
                )}

                {/**********/}
                {/* FOOTER */}
                {/**********/}
                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingTop: 10, zIndex: 1, paddingBottom: TIMELINE_CARD_PADDING }}>
                    <PostDetailsActionBar likes={likes} comments={comments} onLike={handleOnLike} />
                </View>

                <View style={{ height: 0, width: 0, position: 'relative' }}>
                    <View style={{ position: 'absolute', zIndex: -1, width: 200, height: 200, left: -132, top: -65, transform: [{ scaleX: -1 }] }}>
                        <LottieView
                            autoPlay={false}
                            duration={1000}
                            ref={animation}
                            style={{
                                width: 80,
                                height: 80,
                            }}
                            source={require('../../../../resources/lottie-heart.json')}
                        />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
