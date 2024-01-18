import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { ImageUtility } from 'src/util/images/ImageUtility';
import { CarouselCards, ImageCarouselImage } from '../common/images/ImageCarousel';
import PostDetailsActionBar from '../common/comments/PostDetailsActionBar';
import { CardHeader } from './card_components/CardHeader';
import { DailyResultBody } from '../common/timeline/DailyResultBody';
import { TimelineElementType } from 'resources/types/requests/Timeline';
import { PlannedDayResult } from 'resources/schema';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import DAILY_RESULT_DETAILS = Routes.DAILY_RESULT_DETAILS;
import { InteractableData } from 'src/components/timeline/InteractableElementCustomHooks';

interface Props {
    plannedDayResult: PlannedDayResult;
    interactableData: InteractableData;
}

export const PlannedDayResultElement = ({ plannedDayResult, interactableData }: Props) => {
    const { colors } = useTheme();
    const navigation = useEmbtrNavigation();

    if (!plannedDayResult.createdAt || !plannedDayResult.plannedDay?.user) {
        return <View />;
    }

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
                        <PostDetailsActionBar interactableData={interactableData} />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};
