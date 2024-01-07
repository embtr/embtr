import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentUser } from 'src/redux/user/GlobalState';
import { ImageUtility } from 'src/util/images/ImageUtility';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';
import { CardHeader } from './card_components/CardHeader';
import DailyResultController, {
    PlannedDayResultCustomHooks,
} from 'src/controller/timeline/daily_result/DailyResultController';
import { DailyResultBody } from '../common/timeline/DailyResultBody';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { PlannedDayResult } from 'resources/schema';
import React from 'react';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import DAILY_RESULT_DETAILS = Routes.DAILY_RESULT_DETAILS;

interface Props {
    initialPlannedDayResult: PlannedDayResult;
}

export const PlannedDayResultTimelineElement = ({ initialPlannedDayResult }: Props) => {
    const { colors } = useTheme();

    const navigation = useEmbtrNavigation();
    const currentUser = useAppSelector(getCurrentUser);

    const [modified, setModified] = React.useState(false);

    const idToUse = !modified ? 0 : initialPlannedDayResult.id;
    const updatedPlannedDayResult = PlannedDayResultCustomHooks.usePlannedDayResult(idToUse);
    const plannedDayResult = updatedPlannedDayResult.data ?? initialPlannedDayResult;

    if (!plannedDayResult || !plannedDayResult.createdAt || !plannedDayResult.plannedDay?.user) {
        return <View />;
    }

    const likeCount = plannedDayResult.likes?.length ?? 0;
    const commentCount = plannedDayResult.comments?.length ?? 0;
    const isLiked = plannedDayResult.likes?.some((like) => like.userId === currentUser.id) ?? false;

    const handleOnLike = async () => {
        if (isLiked || !plannedDayResult.id) {
            return;
        }

        await DailyResultController.addLikeViaApi(plannedDayResult.id);
        DailyResultController.invalidate(plannedDayResult.id);
        setModified(true);
    };

    let carouselImages: ImageCarouselImage[] = ImageUtility.createReadOnlyCarouselImages(
        plannedDayResult.images ?? []
    );

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                if (!plannedDayResult.id) {
                    return;
                }

                navigation.navigate(DAILY_RESULT_DETAILS, {
                    id: plannedDayResult.id,
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
                    date={plannedDayResult.createdAt}
                    user={plannedDayResult.plannedDay?.user}
                    secondaryText={'secondary text here'}
                    type={TimelineElementType.PLANNED_DAY_RESULT}
                />

                {/**********/}
                {/* TITLE */}
                {/**********/}
                {plannedDayResult.title && (
                    <View style={{ paddingTop: 12 }}>
                        <Text
                            style={{
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 14,
                                color: colors.text,
                            }}
                        >
                            {plannedDayResult.title}
                        </Text>
                    </View>
                )}

                {/**********/}
                {/*  BODY  */}
                {/**********/}
                {plannedDayResult.description && (
                    <View style={{ paddingTop: 12 }}>
                        <Text
                            numberOfLines={3}
                            style={{
                                fontFamily: POPPINS_REGULAR,
                                fontSize: 13,
                                color: colors.text,
                            }}
                        >
                            {plannedDayResult.description}
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
                {/* COMPLETED HABITS */}
                {/********************/}
                {plannedDayResult && (
                    <View style={{ paddingTop: 12 }}>
                        <DailyResultBody plannedDayResult={plannedDayResult} />
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
