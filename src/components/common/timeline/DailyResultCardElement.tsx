import * as React from 'react';
import { Text, View } from 'react-native';
import { PlannedTaskModel } from 'src/controller/planning/PlannedDayController';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';

interface Props {
    plannedTask: PlannedTaskModel;
}

export const DailyResultCardElement = ({ plannedTask }: Props) => {
    const { colors } = useTheme();

    let color = 'gray';
    if (plannedTask.status === 'COMPLETE') {
        color = colors.progress_bar_complete;
    } else if (plannedTask.status === 'FAILED') {
        color = colors.progress_bar_failed;
    }

    let [fontsLoaded] = useFonts({
        Poppins_400Regular,
        Poppins_600SemiBold,
    });

    if (!fontsLoaded) {
        return <View />;
    }

    return (
        <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View
                    style={{
                        width: 28,
                        height: 28,
                        borderColor: color,
                        borderWidth: 2,
                        borderRadius: 9,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {plannedTask.status === 'FAILED' ? (
                        <View style={{}}>
                            <Text style={{ color: color }}>X</Text>
                        </View>
                    ) : plannedTask.status === 'COMPLETE' ? (
                        <Ionicons name={'checkmark'} size={20} color={color} />
                    ) : (
                        <View style={{}}>
                            <Text style={{ color: color }}>~</Text>
                        </View>
                    )}
                </View>

                <View style={{ paddingLeft: 5 }}>
                    <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 12 }}> {plannedTask.routine.name} </Text>
                    <Text style={{ color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 9 }}>5 hours ago</Text>
                </View>
            </View>
        </View>
    );
};
