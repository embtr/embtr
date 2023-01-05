import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { RoutineModel } from 'src/controller/routine/RoutineController';
import RoutineHabitController, { RoutineHabitModel } from 'src/controller/routine/RoutineHabitController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';

interface Props {
    routine: RoutineModel;
}

export const RoutinePreview = ({ routine }: Props) => {
    const { colors } = useTheme();

    const [routineHabits, setRoutineHabits] = React.useState<RoutineHabitModel[]>([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetch = async () => {
                const routineHabits = await RoutineHabitController.getAllInRoutine(routine);
                setRoutineHabits(routineHabits);
            };

            fetch();
        }, [])
    );

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();
    const navigateToDetails = () => {
        navigation.navigate('RoutineDetails', { id: routine.id });
    };

    return (
        <View style={{ width: '97%' }}>
            <TouchableWithoutFeedback onPress={navigateToDetails}>
                <View style={[{ backgroundColor: colors.timeline_card_background, borderRadius: 9 }, CARD_SHADOW]}>
                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text style={{ color: colors.goal_primary_font, fontFamily: POPPINS_SEMI_BOLD, fontSize: 14 }}>{routine.name}</Text>
                            <Text style={{ color: colors.goal_secondary_font, opacity: 0.9, fontFamily: POPPINS_REGULAR, fontSize: 10 }}>
                                {routine.description}
                            </Text>
                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flexDirection: 'row', paddingLeft: 10, alignItems: 'center', flex: 1 }}>
                            <Ionicons name={'calendar-outline'} size={20} color={colors.profile_pillar_attribute_icon} />
                            <View style={{ paddingLeft: 5 }}>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        fontFamily: 'Poppins_400Regular',
                                        color: colors.profile_pillar_attribute_name,
                                        opacity: 0.8,
                                    }}
                                >
                                    Added
                                </Text>
                                <Text style={{ fontSize: 11, fontFamily: 'Poppins_400Regular', color: colors.tab_selected }}>
                                    {format(routine.added.toDate(), 'MMM dd, yyyy')}
                                </Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <FontAwesome name="tasks" size={20} color={colors.profile_pillar_attribute_icon} />
                            <View style={{ paddingLeft: 5 }}>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        fontFamily: 'Poppins_400Regular',
                                        color: colors.profile_pillar_attribute_name,
                                        opacity: 0.8,
                                    }}
                                >
                                    Number Of Habits
                                </Text>
                                <Text style={{ fontSize: 11, fontFamily: 'Poppins_400Regular', color: '#c809eb' }}>{routineHabits.length}</Text>
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <FontAwesome name="tasks" size={20} color={colors.profile_pillar_attribute_icon} />
                            <View style={{ paddingLeft: 5 }}>
                                <Text
                                    style={{
                                        fontSize: 10,
                                        fontFamily: 'Poppins_400Regular',
                                        color: colors.profile_pillar_attribute_name,
                                        opacity: 0.8,
                                    }}
                                >
                                    Some Data
                                </Text>
                                <Text style={{ fontSize: 11, fontFamily: 'Poppins_400Regular', color: colors.progress_bar_complete }}>
                                    {routineHabits.length}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};
