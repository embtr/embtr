import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { PlannedDay } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PlannedDayController from 'src/controller/planning/PlannedDayController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import { Routes, TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getFireConfetti } from 'src/redux/user/GlobalState';
import { PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';

interface Styles {
    container: ViewStyle;
    topText: TextStyle;
    bottomTextContainer: ViewStyle;
    bottomText: TextStyle;
}

const generateStyles = (colors: any): Styles => {
    return {
        container: {
            height: 60,
            backgroundColor: colors.card_new_background,
            justifyContent: 'center',
            alignContent: 'center',
            borderRadius: 5,
        },
        topText: {
            flex: 1,
            top: 2,
            color: colors.secondary_text,
            fontFamily: POPPINS_REGULAR,
            textAlign: 'center',
        },
        bottomTextContainer: {
            flex: 1,
            flexDirection: 'row',
            alignContent: 'center',
            justifyContent: 'center',
        },
        bottomText: {
            top: 2,
            color: colors.accent_color_light,
            includeFontPadding: false,
            fontFamily: POPPINS_REGULAR,
        },
    };
};

interface Props {
    plannedDay: PlannedDay;
    hasPlannedTasks: boolean;
    allHabitsAreComplete: boolean;
    dayKey: string;
}

export const PlanDayHeader = ({
    plannedDay,
    hasPlannedTasks,
    allHabitsAreComplete,
    dayKey,
}: Props) => {
    const { colors } = useTheme();
    const styles = generateStyles(colors);

    const plannedDayResultsAreShared = (plannedDay.plannedDayResults?.length ?? 0) > 0;
    const navigation = useEmbtrNavigation();
    const fireConfetti = useAppSelector(getFireConfetti);

    const onShare = async () => {
        if (plannedDay.id) {
            await DailyResultController.create(plannedDay.id);
            await PlannedDayController.prefetchPlannedDayData(dayKey);
            fireConfetti();
        }
    };

    const onNavigateToDailyResult = () => {
        if (
            (plannedDay.plannedDayResults?.length ?? 0) < 1 ||
            plannedDay.plannedDayResults?.[0]?.id === undefined
        ) {
            return;
        }

        const id = plannedDay.plannedDayResults[0].id;
        navigation.navigate(Routes.DAILY_RESULT_DETAILS, {
            id,
        });
    };

    let header = undefined;
    if (allHabitsAreComplete) {
        header = (
            <View style={styles.container}>
                <Text style={styles.topText}>All of today's habits are complete 🎉</Text>
                {!plannedDayResultsAreShared ? (
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                        }}
                    >
                        <TouchableOpacity
                            onPress={onShare}
                            style={{
                                backgroundColor: colors.accent_color,
                                borderRadius: 2.5,
                                marginHorizontal: PADDING_LARGE,
                            }}
                        >
                            <Text
                                style={{
                                    paddingVertical: PADDING_LARGE / 8,
                                    lineHeight: 20,
                                    color: colors.text,
                                    textAlign: 'center',
                                    fontFamily: POPPINS_REGULAR,
                                }}
                            >
                                Share your results
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.bottomTextContainer}>
                        <Text onPress={onNavigateToDailyResult} style={styles.bottomText}>
                            View today's results
                        </Text>
                    </View>
                )}
            </View>
        );
    } else if (!hasPlannedTasks) {
        header = (
            <View style={styles.container}>
                <Text style={styles.topText}>No habits planned for today...</Text>
                <View style={styles.bottomTextContainer}>
                    <Text
                        onPress={() => {
                            navigation.navigate(Routes.ADD_HABIT_CATEGORIES);
                        }}
                        style={styles.bottomText}
                    >
                        let's change that!
                    </Text>
                </View>
            </View>
        );
    } else {
        header = <View></View>;
    }

    return header;
};
