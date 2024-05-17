import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { ImageUtility } from 'src/util/images/ImageUtility';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { InteractableData } from 'src/components/timeline/interactable/InteractableElementCustomHooks';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { CarouselCards, ImageCarouselImage } from 'src/components/common/images/ImageCarousel';
import { CardHeader } from '../card_components/CardHeader';
import PostDetailsActionBar from 'src/components/common/comments/PostDetailsActionBar';
import { PlannedTaskResultGroups } from './PlannedTaskResultGroups';
import { PlannedDayResultAttribute } from './PlannedDayResultAttribute';
import { PlannedDayResultDto } from 'resources/types/dto/PlannedDay';

interface Props {
    plannedDayResult: PlannedDayResultDto;
    interactableData: InteractableData;
    habitLimit?: number;
}

export const PlannedDayResultElement = ({
    plannedDayResult,
    interactableData,
    habitLimit,
}: Props) => {
    const { colors } = useTheme();

    if (!plannedDayResult.createdAt || !plannedDayResult.plannedDay?.user) {
        return <View />;
    }

    let carouselImages: ImageCarouselImage[] = ImageUtility.createReadOnlyCarouselImages(
        plannedDayResult.images ?? []
    );

    const secondaryHeader = plannedDayResult.plannedDay.user.location ?? '';
    const isCurrentUser = getCurrentUid() === plannedDayResult.plannedDay.user.uid;
    const padding = PADDING_LARGE * 1.5;

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
                date={plannedDayResult.createdAt}
                user={plannedDayResult.plannedDay?.user}
                dayKey={plannedDayResult.plannedDay?.dayKey}
                secondaryText={secondaryHeader}
                type={TimelineElementType.PLANNED_DAY_RESULT}
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
            {plannedDayResult.description && (
                <View style={{ paddingTop: padding }}>
                    <Text
                        style={{
                            fontFamily: POPPINS_REGULAR,
                            fontSize: 13,
                            lineHeight: 15,
                            color: colors.text,
                            top: 2,
                        }}
                    >
                        {plannedDayResult.description}
                    </Text>
                </View>
            )}

            {/*************/}
            {/* ATTRIBUTE */}
            {/*************/}
            {plannedDayResult.attribute && (
                <View
                    style={{
                        paddingTop: padding,
                    }}
                >
                    <PlannedDayResultAttribute plannedDayResult={plannedDayResult} />
                </View>
            )}

            {/********************/}
            {/* COMPLETED HABITS */}
            {/********************/}
            {plannedDayResult && (
                <View style={{ paddingTop: padding }}>
                    <PlannedTaskResultGroups
                        plannedDayResult={plannedDayResult}
                        habitLimit={habitLimit}
                    />
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
