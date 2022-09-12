import { View, Text, TextStyle, Image } from 'react-native';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDateFromDayKey, PlannedDay, plannedDayIsComplete } from 'src/controller/planning/PlannedDayController';
import { getDayOfWeek } from 'src/controller/planning/TaskController';
import { DailyResultModel } from 'src/controller/timeline/daily_result/DailyResultController';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { CarouselCards, ImageCarouselImage } from '../images/ImageCarousel';
import { DailyResultCardElement } from './DailyResultCardElement';

interface Props {
    dailyResult: DailyResultModel;
    plannedDay: PlannedDay;
}

export const DailyResultBody = ({ dailyResult, plannedDay }: Props) => {
    const { colors } = useTheme();

    const headerTextStyle = {
        fontSize: 16,
        fontFamily: 'Poppins_500Medium',
        color: colors.timeline_card_body,
        paddingLeft: TIMELINE_CARD_PADDING,
    } as TextStyle;

    let completedCount = 0;
    plannedDay?.plannedTasks.forEach((plannedTask) => {
        if (plannedTask.status === 'COMPLETE') {
            completedCount += 1;
        }
    });

    const progress = plannedDay ? (completedCount / plannedDay.plannedTasks.length) * 100 : 100;

    const dayOfWeek = getDayOfWeek(getDateFromDayKey(plannedDay?.id ? plannedDay?.id : ''));

    let plannedTaskViews: JSX.Element[] = [];

    plannedDay?.plannedTasks.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View key={plannedTask.id} style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    let images: ImageCarouselImage[] = [
        {
            url: 'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/timeline%2Fhorizontal.jpeg?alt=media&token=1cb00109-cb1d-4a11-855f-99c93688e9a5',
            format: 'HORIZONTAL',
        },
        {
            url: 'https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/timeline%2Fvertical.jpeg?alt=media&token=a3aefa6f-34f5-45c7-864e-cd2621feca82',
            format: 'VERTICAL',
        },
    ];

    return (
        <View>
            <View style={{ paddingTop: 10 }}>
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: '94%', alignItems: 'center', justifyContent: 'center' }}>
                        <ProgressBar progress={progress} success={plannedDayIsComplete(plannedDay)} />
                    </View>
                </View>

                <View style={{ paddingTop: 5 }}>
                    <Text style={headerTextStyle}>
                        {dayOfWeek.substring(0, 1).toUpperCase() + dayOfWeek.substring(1)}{' '}
                        <Text style={{ color: plannedDayIsComplete(plannedDay) ? colors.progress_bar_complete : colors.progress_bar_failed }}>
                            {plannedDayIsComplete(plannedDay) ? 'Complete!' : 'Failed!'}
                        </Text>
                    </Text>
                </View>

                <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 5 }}>
                    <Text style={[{ textAlign: 'left', paddingTop: 5 }]}>man, I tried really hard on this one! I will get it next time.</Text>

                    <View style={{ paddingTop: 15 }}>
                        <CarouselCards images={images} />
                    </View>
                    
                    <View style={{ paddingTop: 15 }}>{plannedTaskViews}</View>

                </View>
            </View>
        </View>
    );
};
