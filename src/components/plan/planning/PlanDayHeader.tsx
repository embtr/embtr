import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { PlannedDay } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Routes } from 'src/navigation/RootStackParamList';
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
}

export const PlanDayHeader = ({ plannedDay, hasPlannedTasks, allHabitsAreComplete }: Props) => {
    const { colors } = useTheme();
    const styles = generateStyles(colors);

    const plannedDayResultsAreShared = (plannedDay.plannedDayResults?.length ?? 0) > 0;
    const navigation = useEmbtrNavigation();

    const navigateToCreatePlannedDayResult = () => {
        navigation.navigate(Routes.CREATE_PLANNED_DAY_RESULT, { dayKey: plannedDay.dayKey ?? '' });
    };

    const navigateToPlannedDayResultDetails = () => {
        const id = plannedDay.plannedDayResults?.[0]?.id;
        if (!id) {
            return;
        }

        navigation.navigate(Routes.PLANNED_DAY_RESULT_DETAILS, { id: id });
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
                            onPress={navigateToCreatePlannedDayResult}
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
                                Share Your Results!
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.bottomTextContainer}>
                        <Text onPress={navigateToPlannedDayResultDetails} style={styles.bottomText}>
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
                            // @ts-ignore :(
                            navigation.navigate('MyHabitsTab');
                        }}
                        style={styles.bottomText}
                    >
                        Manage Your Habits
                    </Text>
                </View>
            </View>
        );
    } else {
        header = <View></View>;
    }

    return header;
};
