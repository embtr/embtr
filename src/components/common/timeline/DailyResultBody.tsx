import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM } from 'src/util/constants';
import { ImageCarouselImage } from '../images/ImageCarousel';
import { DailyResultCardElement } from './DailyResultCardElement';
import { PlannedDayResult as PlannedDayResultModel } from 'resources/schema';
import { SvgUri } from 'react-native-svg';
import { ImageUtility } from 'src/util/images/ImageUtility';

interface Props {
    plannedDayResult: PlannedDayResultModel;
    navigateToDetails?: Function;
}

export const DailyResultBody = ({ plannedDayResult, navigateToDetails }: Props) => {
    const { colors } = useTheme();

    const challengeName = plannedDayResult.plannedDay?.challengeParticipant?.[0]?.challenge?.name;
    const svgUrl =
        plannedDayResult.plannedDay?.challengeParticipant?.[0]?.challenge?.challengeRewards?.[0]
            ?.imageUrl;

    let plannedTaskViews: JSX.Element[] = [];
    plannedDayResult.plannedDay?.plannedTasks?.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View key={plannedTask.id} style={{ paddingBottom: 7.5 }}>
                <DailyResultCardElement plannedTask={plannedTask} />
            </View>
        );
    });

    const carouselImages: ImageCarouselImage[] = ImageUtility.createReadOnlyCarouselImages(
        plannedDayResult.images ?? []
    );

    let completedCount = 0;
    plannedDayResult.plannedDay?.plannedTasks?.forEach((plannedTask) => {
        if (plannedTask.status === 'COMPLETE') {
            completedCount++;
        }
    });

    return (
        <View style={{}}>
            {plannedDayResult.description && (
                <Text style={[{ textAlign: 'left', paddingBottom: 10, color: colors.text }]}>
                    {plannedDayResult.description}
                </Text>
            )}

            {svgUrl && (
                <View style={{ paddingBottom: 10, paddingTop: 2.5 }}>
                    <View
                        style={{
                            paddingVertical: 7.5,
                            paddingLeft: 7.5,
                            borderWidth: 1,
                            borderRadius: 3,
                            borderColor: colors.secondary_text,
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <SvgUri width={50} height={50} uri={svgUrl ?? ''} />
                            <View style={{ paddingLeft: 7.5 }}>
                                <Text style={{ color: colors.text, fontFamily: POPPINS_MEDIUM }}>
                                    Challenge Complete
                                </Text>
                                <Text
                                    style={{
                                        color: colors.tab_selected,
                                        fontFamily: POPPINS_MEDIUM,
                                    }}
                                >
                                    {challengeName}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            )}

            <View style={{ paddingTop: 5, paddingBottom: 2 }}>{plannedTaskViews}</View>
        </View>
    );
};
