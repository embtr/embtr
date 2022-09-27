import { View, Text, LayoutRectangle } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { plannedTaskIsComplete, plannedTaskIsFailed, PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { CALENDAR_TIME_HEIGHT } from 'src/util/constants';

interface Props {
    plannedTask: PlannedTaskModel;
    parentLayout?: LayoutRectangle;
    rowIndex: number;
    totalInRow: number;
}

export const GuestCalendarPlanView = ({ plannedTask, rowIndex, totalInRow, parentLayout }: Props) => {
    const { colors } = useTheme();
    const { setScheme, isDark } = useTheme();

    const cardShadow = {
        shadowColor: '#000',
        shadowOffset: { width: 2.5, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    };

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold,
        Poppins_400Regular,
    });

    if (!fontsLoaded) {
        return <View />;
    }

    let width = 0;
    if (parentLayout?.width) {
        width = parentLayout.width / totalInRow - 80 / totalInRow - 4;
    }
    let paddingRight = width * rowIndex + 80 + rowIndex * 4;

    return (
        <View style={{ marginLeft: paddingRight, top: plannedTask.startMinute! + CALENDAR_TIME_HEIGHT / 2, position: 'absolute' }}>
            <View
                style={[
                    isDark ? {} : cardShadow,
                    {
                        minHeight: 50,
                        height: plannedTask.duration ? plannedTask.duration : plannedTask.duration,
                        width: totalInRow === 1 ? 225 : width,
                        borderRadius: 6,
                        backgroundColor: colors.timeline_card_background,
                    },
                ]}
            >
                <View style={{ flexDirection: 'row', width: '100%', paddingTop: 5, paddingLeft: 5 }}>
                    <View style={{ flex: 5 }}>
                        <Text style={{ color: colors.text, fontFamily: 'Poppins_600SemiBold', fontSize: 13 }}>{plannedTask.routine.name}</Text>
                        <Text style={{ color: colors.text, fontFamily: 'Poppins_400Regular', fontSize: 9 }}>{plannedTask.routine.description}</Text>
                    </View>

                    <View style={{ flex: 1, alignItems: 'flex-end', paddingRight: 5 }}>
                        {plannedTaskIsFailed(plannedTask) ? (
                            <View style={{ paddingRight: 3, paddingTop: 3 }}>
                                <Text style={{ color: 'red' }}>X</Text>
                            </View>
                        ) : (
                            <Ionicons
                                name={plannedTaskIsComplete(plannedTask) ? 'checkmark-done' : 'checkmark'}
                                size={20}
                                color={plannedTaskIsComplete(plannedTask) ? 'green' : colors.secondary_text}
                            />
                        )}
                    </View>
                </View>
            </View>
        </View>
    );
};
