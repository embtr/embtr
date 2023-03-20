import { View, Text, TextStyle } from 'react-native';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getDayOfWeek } from 'src/controller/planning/TaskController';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { ImageCarouselImage } from '../images/ImageCarousel';
import { DailyResultCardElement } from './DailyResultCardElement';
import { PlannedDayResultModel } from 'resources/models/PlannedDayResultModel';

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
    const dayOfWeek = getDayOfWeek(plannedDayResult.plannedDay?.date!);

    let totalTasks = plannedDayResult.plannedDay?.plannedTasks?.length;
    let completedCount = 0;
    plannedDayResult.plannedDay?.plannedTasks?.forEach((plannedTask) => {
        if (plannedTask.status === 'COMPLETE') {
            completedCount++;
        }
    });

    const percentComplete = 100 * (completedCount / totalTasks!);

    return (
        <View style={{ paddingTop: 10 }}>
            <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: '94%', alignItems: 'center', justifyContent: 'center' }}>
                    <ProgressBar progress={percentComplete} success={true} />
                </View>
            </View>

            <View style={{ paddingTop: 5 }}>
                <Text style={headerTextStyle}>{dayOfWeek}</Text>
            </View>

            <View style={{ paddingLeft: TIMELINE_CARD_PADDING, paddingRight: TIMELINE_CARD_PADDING, paddingTop: 5 }}>
                <Text style={[{ textAlign: 'left', paddingTop: 5, color: colors.text }]}>{plannedDayResult.description}</Text>
                <View style={{ paddingTop: 5 }}>
                    <View style={{ paddingTop: 5, paddingBottom: 2 }}>{plannedTaskViews}</View>
                </View>
            </View>
        </View>
    );
};
