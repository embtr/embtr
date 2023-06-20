import { View, Text, TextStyle } from 'react-native';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getUTCDayOfWeek } from 'src/controller/planning/TaskController';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { CarouselCards, ImageCarouselImage } from '../images/ImageCarousel';
import { DailyResultCardElement } from './DailyResultCardElement';
import { PlannedDayResult as PlannedDayResultModel } from 'resources/schema';
import { getDatePretty } from 'src/util/DateUtility';

interface Props {
    plannedDayResult: PlannedDayResultModel;
    navigateToDetails?: Function;
}

export const DailyResultBody = ({ plannedDayResult, navigateToDetails }: Props) => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

    let plannedTaskViews: JSX.Element[] = [];
    plannedDayResult.plannedDay?.plannedTasks?.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View key={plannedTask.id} style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    let carouselImages: ImageCarouselImage[] = [];
    plannedDayResult.images?.forEach((plannedDayResultImage) => {
        if (!plannedDayResultImage.url) {
            return;
        }

        carouselImages.push({
            url: plannedDayResultImage.url,
            format: 'png',
            type: 'image',
        });
    });

    const dayOfWeek = getUTCDayOfWeek(plannedDayResult.plannedDay?.date!);

    let totalTasks = plannedDayResult.plannedDay?.plannedTasks?.length;
    let completedCount = 0;
    plannedDayResult.plannedDay?.plannedTasks?.forEach((plannedTask) => {
        if (plannedTask.status === 'COMPLETE') {
            completedCount++;
        }
    });

    return (
        <View style={{ paddingTop: 10 }}>
            <View
                style={{
                    paddingLeft: TIMELINE_CARD_PADDING,
                    paddingRight: TIMELINE_CARD_PADDING,
                    paddingTop: 5,
                }}
            >
                {plannedDayResult.description && (
                    <Text style={[{ textAlign: 'left', paddingBottom: 10, color: colors.text }]}>
                        {plannedDayResult.description}
                    </Text>
                )}

                <View style={{ paddingTop: 5, paddingBottom: 2 }}>{plannedTaskViews}</View>
            </View>

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
        </View>
    );
};
