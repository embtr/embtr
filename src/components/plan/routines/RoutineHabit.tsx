import { View, Text, TouchableOpacity } from 'react-native';
import { CARD_SHADOW } from 'src/util/constants';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu, getOpenMenu } from 'src/redux/user/GlobalState';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { RoutineHabitModel } from 'src/controller/routine/RoutineHabitController';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    routineHabit: RoutineHabitModel;
}

export const RoutineHabit = ({ routineHabit }: Props) => {
    const [editPlannedTaskIsVisible, setEditPlannedTaskIsVisible] = React.useState<boolean>(false);
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const { colors } = useTheme();

    const dispatch = useAppDispatch();

    const toggleComplete = () => {};

    const toggleFailed = () => {};

    const updateMenuOptions = () => {};

    const openMenu = useAppSelector(getOpenMenu);
    const closeMenu = useAppSelector(getCloseMenu);

    const onShortPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        updateMenuOptions();
        openMenu();
    };

    const onLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        setEditPlannedTaskIsVisible(true);
    };

    return (
        <View style={{ width: '100%' }}>
            <TouchableOpacity onPress={onShortPress} onLongPress={onLongPress}>
                <View style={[{ backgroundColor: colors.button_background, borderRadius: 15 }, CARD_SHADOW]}>
                    <View style={{ borderRadius: 15, flexDirection: 'row', overflow: 'hidden' }}>
                        <View style={{ width: '100%', paddingTop: 5, paddingBottom: 5 }}>
                            <View style={{ paddingLeft: 10, flexDirection: 'row' }}>
                                <Text
                                    style={{
                                        color: colors.goal_primary_font,
                                        fontFamily: 'Poppins_600SemiBold',
                                        fontSize: 14,
                                    }}
                                >
                                    {routineHabit.habit.name}
                                </Text>
                                <Text
                                    style={{
                                        color: colors.tab_selected,
                                        fontFamily: 'Poppins_400Regular',
                                        fontSize: 9,
                                        paddingStart: 5,
                                    }}
                                >
                                    habit
                                </Text>
                            </View>

                            <View style={{ paddingTop: 8, marginLeft: 10, marginRight: 10 }}>
                                <HorizontalLine />
                            </View>

                            <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 2 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <Ionicons name={'time'} size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        12:00
                                    </Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <MaterialCommunityIcons name="timer" size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        30
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <Ionicons name={'stats-chart-outline'} size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        goal 1
                                    </Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <MaterialCommunityIcons name="pillar" size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        pillar 1
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};
