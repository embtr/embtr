import { View, Text, Pressable } from 'react-native';
import {
    CompletedHabit,
    PlannedDayResultSummary,
} from 'resources/types/planned_day_result/PlannedDayResult';
import { CompletedHabitElement } from './CompletedHabitElement';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_MEDIUM } from 'src/util/constants';
import { FlatList } from 'react-native-gesture-handler';
import { getDayOfWeekFromDayKey } from 'src/controller/planning/TaskController';
import { CarouselCards, ImageCarouselImage } from '../../images/ImageCarousel';
import { ImageUtility } from 'src/util/images/ImageUtility';

interface Props {
    plannedDayResultSummary: PlannedDayResultSummary;
    navigateToDetails?: Function;
}

export const PlannedDayResultBody = ({ plannedDayResultSummary, navigateToDetails }: Props) => {
    const { colors } = useTheme();

    const dayOfWeek = getDayOfWeekFromDayKey(
        plannedDayResultSummary.plannedDayResult.plannedDay?.dayKey ?? ''
    );

    const carouselImages: ImageCarouselImage[] = ImageUtility.createReadOnlyCarouselImages(
        plannedDayResultSummary.plannedDayResult.images ?? []
    );

    const renderElement = ({ item }: { item: CompletedHabit }) => {
        return (
            <View key={item.habit.id} style={{ paddingHorizontal: 5 }}>
                <View style={{ flexDirection: 'row' }} onStartShouldSetResponder={() => true}>
                    <Pressable onPress={() => navigateToDetails?.()}>
                        <CompletedHabitElement completedHabit={item} color={colors.text} />
                    </Pressable>
                </View>
            </View>
        );
    };

    return (
        <View>
            <View style={{ paddingLeft: 10, paddingBottom: 7.5 }}>
                <Text style={{ fontFamily: POPPINS_MEDIUM, color: colors.text }}>{dayOfWeek}</Text>
            </View>
            <View style={{ paddingHorizontal: 5 }}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={plannedDayResultSummary.completedHabits}
                    renderItem={renderElement}
                />
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
