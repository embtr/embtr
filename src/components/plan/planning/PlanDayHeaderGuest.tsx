import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, ViewStyle, TextStyle } from 'react-native';
import { PlannedDay } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Routes, TimelineTabScreens } from 'src/navigation/RootStackParamList';
import { POPPINS_REGULAR } from 'src/util/constants';

interface Styles {
    container: ViewStyle;
    topText: TextStyle;
    noTasksText: TextStyle;
    bottomTextContainer: ViewStyle;
    bottomText: TextStyle;
}

const generateStyles = (colors: any): Styles => {
    return {
        container: {
            height: 60,
            borderColor: '#404040',
            backgroundColor: '#343434',
            borderWidth: 1,
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
        noTasksText: {
            color: colors.secondary_text,
            fontFamily: POPPINS_REGULAR,
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

export const PlanDayHeaderGuest = ({
    plannedDay,
    hasPlannedTasks,
    allHabitsAreComplete,
    dayKey,
}: Props) => {
    const { colors } = useTheme();
    const styles = generateStyles(colors);

    const plannedDayResultsAreShared = (plannedDay.plannedDayResults?.length ?? 0) > 0;
    const navigation = useNavigation<StackNavigationProp<TimelineTabScreens>>();

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
                {plannedDayResultsAreShared && (
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
                <Text style={styles.noTasksText}>Things are quiet... too quiet...</Text>
        );
    }

    return header;
};
