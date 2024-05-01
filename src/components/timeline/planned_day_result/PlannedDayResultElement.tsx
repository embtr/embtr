import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { ImageUtility } from 'src/util/images/ImageUtility';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { PlannedDayResult } from 'resources/schema';
import { InteractableData } from 'src/components/timeline/interactable/InteractableElementCustomHooks';
import { getCurrentUid } from 'src/session/CurrentUserProvider';
import { CarouselCards, ImageCarouselImage } from 'src/components/common/images/ImageCarousel';
import { CardHeader } from '../card_components/CardHeader';
import PostDetailsActionBar from 'src/components/common/comments/PostDetailsActionBar';
import { PlannedTaskResultGroups } from './PlannedTaskResultGroups';

interface Props {
    plannedDayResult: PlannedDayResult;
    interactableData: InteractableData;
}

export const PlannedDayResultElement = ({ plannedDayResult, interactableData }: Props) => {
    const { colors } = useTheme();

    if (!plannedDayResult.createdAt || !plannedDayResult.plannedDay?.user) {
        return <View />;
    }

    let carouselImages: ImageCarouselImage[] = ImageUtility.createReadOnlyCarouselImages(
        plannedDayResult.images ?? []
    );

    const secondaryHeader = plannedDayResult.plannedDay.user.location ?? '';
    const isCurrentUser = getCurrentUid() === plannedDayResult.plannedDay.user.uid;

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
                secondaryText={secondaryHeader}
                type={TimelineElementType.PLANNED_DAY_RESULT}
            />

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
                <View style={{ paddingTop: PADDING_LARGE }}>
                    <PlannedTaskResultGroups plannedDayResult={plannedDayResult} limit={8} />
                </View>
            )}

            {/**********/}
            {/*  BODY  */}
            {/**********/}
            {plannedDayResult.description && (
                <View style={{}}>
                    <Text
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

            {/********************/}
            {/*    ACTION BAR    */}
            {/********************/}
            <View style={{ paddingTop: PADDING_LARGE }}>
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
