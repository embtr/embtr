import { View, Text, TextStyle } from 'react-native';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDateFromDayKey, PlannedDay, plannedDayIsComplete } from 'src/controller/planning/PlannedDayController';
import { getDayOfWeek } from 'src/controller/planning/TaskController';
import { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { CarouselCards, ImageCarouselImage } from '../images/ImageCarousel';
import { DailyResultCardElement } from './DailyResultCardElement';
import { DayResultModel } from 'resources/models/DayResultModel';

interface Props {
    dayResult: DayResultModel;
    navigateToDetails?: Function;
}

export const DailyResultBody = ({ dayResult, navigateToDetails }: Props) => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

    let completedCount = 0;

    let plannedTaskViews: JSX.Element[] = [];
    dayResult.plannedDay?.plannedTasks?.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View key={plannedTask.id} style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    let carouselImages: ImageCarouselImage[] = [];

    return (
        <View>
            <View style={{ paddingTop: 10 }}>
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: '94%', alignItems: 'center', justifyContent: 'center' }}>
                        <ProgressBar progress={80} success={true} />
                    </View>
                </View>

                <View style={{ paddingTop: 5 }}>
                    <Text style={headerTextStyle}>{'Tuesday'}</Text>
                </View>

                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 5 }}>
                    <View style={{ paddingTop: 5 }}>
                        <View style={{ paddingTop: 5, paddingBottom: 2 }}>{plannedTaskViews}</View>
                    </View>
                </View>
            </View>
        </View>
    );
};
