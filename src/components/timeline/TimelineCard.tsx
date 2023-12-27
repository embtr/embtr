import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { ImageUtility } from 'src/util/images/ImageUtility';
import { TimelinePostModel } from 'src/model/OldModels';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';
import { CardHeader } from './card_components/CardHeader';
import { JoinedChallengeDetails } from './card_components/JoinedChallengeDetails';
import StoryController from 'src/controller/timeline/story/StoryController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { DailyResultBody } from '../common/timeline/DailyResultBody';
import { TimelineElementType } from 'resources/types/requests/Timeline';

interface Props {
    timelinePostModel: TimelinePostModel;
    navigateToDetails: Function;
}

export const TimelineCard = ({ timelinePostModel, navigateToDetails }: Props) => {
    const { colors } = useTheme();

    const currentUser = useAppSelector(getCurrentUser);
    const [isLiked, setIsLiked] = React.useState(
        timelinePostModel.likes.some((like) => like.userId === currentUser.id)
    );

    const [likeCount, setLikeCount] = React.useState(timelinePostModel.likes.length);
    const [commentCount, setCommentCount] = React.useState(timelinePostModel.comments.length);

    const handleOnLike = () => {
        if (isLiked) {
            return;
        }

        setIsLiked(true);
        setLikeCount(likeCount + 1);

        if (timelinePostModel.type === TimelineElementType.USER_POST) {
            StoryController.addLikeViaApi(timelinePostModel.id);
            // } else if (timelinePostModel.type === TimelineType.JOINED_CHALLENGE) {
            //     ChallengeController.like(timelinePostModel.id);
        } else if (timelinePostModel.type === TimelineElementType.PLANNED_DAY_RESULT) {
            DailyResultController.addLikeViaApi(timelinePostModel.id);
        }
    };

    let carouselImages: ImageCarouselImage[] = ImageUtility.createReadOnlyCarouselImages(
        timelinePostModel.images
    );

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                navigateToDetails();
            }}
        >
            <View
                style={[
                    {
                        backgroundColor: colors.timeline_card_background,
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
                    date={timelinePostModel.sortDate}
                    user={timelinePostModel.user}
                    secondaryText={timelinePostModel.secondaryHeaderText}
                    type={timelinePostModel.type}
                />

                {/**********/}
                {/* TITLE */}
                {/**********/}
                {timelinePostModel.title && (
                    <View style={{ paddingTop: 12 }}>
                        <Text
                            style={{
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 14,
                                color: colors.text,
                            }}
                        >
                            {timelinePostModel.title}
                        </Text>
                    </View>
                )}

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                {timelinePostModel.body && (
                    <View style={{ paddingTop: 12 }}>
                        <Text
                            numberOfLines={3}
                            style={{
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 13,
                                color: colors.text,
                            }}
                        >
                            {timelinePostModel.body}
                        </Text>
                    </View>
                )}

                {/**********/}
                {/* IMAGES */}
                {/**********/}
                {carouselImages.length > 0 && (
                    <View
                        style={{
                            marginLeft: 10,
                            marginRight: 10,
                            overflow: 'hidden',
                            paddingTop: 10,
                            alignItems: 'center',
                        }}
                    >
                        <CarouselCards images={carouselImages} />
                    </View>
                )}

                {/*********************/}
                {/* Challenge Details */}
                {/*********************/}
                {timelinePostModel.joinedChallenge && (
                    <View style={{ paddingTop: 12 }}>
                        <JoinedChallengeDetails
                            joinedChallenge={timelinePostModel.joinedChallenge}
                        />
                    </View>
                )}

                {/********************/}
                {/* COMPLETED HABITS */}
                {/********************/}
                {timelinePostModel.plannedDayResult && (
                    <View style={{ paddingTop: 12 }}>
                        <DailyResultBody plannedDayResult={timelinePostModel.plannedDayResult} />
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
