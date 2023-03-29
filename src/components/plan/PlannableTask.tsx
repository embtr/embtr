import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW } from 'src/util/constants';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { createEmbtrMenuOptions, EmbtrMenuOption } from '../common/menu/EmbtrMenuOption';
import { getCloseMenu, getOpenMenu, setMenuOptions } from 'src/redux/user/GlobalState';
import * as Haptics from 'expo-haptics';
import { TaskInProgressSymbol } from '../common/task_symbols/TaskInProgressSymbol';
import { PlannedTask as PlannedTaskModel } from 'resources/schema';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import { TaskCompleteSymbol } from '../common/task_symbols/TaskCompleteSymbol';
import { TaskFailedSymbol } from '../common/task_symbols/TaskFailedSymbol';

interface Props {
    plannedTask: PlannedTaskModel;
    onUpdateTask: Function;
    isEnabled: boolean;
}

export const PlannableTask = ({ plannedTask, onUpdateTask, isEnabled }: Props) => {
    const { colors } = useTheme();

    const dispatch = useAppDispatch();

    const toggleComplete = async () => {
        if (!plannedTask) return;

        plannedTask.status = 'COMPLETE';
        await PlannedTaskController.updateViaApi(plannedTask);
        onUpdateTask(plannedTask);
    };

    const toggleIncomplete = async () => {
        if (!plannedTask) return;

        plannedTask.status = 'INCOMPLETE';
        await PlannedTaskController.updateViaApi(plannedTask);
        onUpdateTask(plannedTask);
    };

    const toggleFailed = async () => {
        if (!plannedTask) return;

        plannedTask.status = 'FAILED';
        await PlannedTaskController.updateViaApi(plannedTask);
        onUpdateTask(plannedTask);
    };

    const toggleDeleted = async () => {
        if (!plannedTask) return;

        plannedTask.active = false;

        await PlannedTaskController.updateViaApi(plannedTask);
        onUpdateTask(plannedTask);
    };

    const updateMenuOptions = () => {
        if (!plannedTask || !onUpdateTask) {
            return;
        }

        let menuOptions: EmbtrMenuOption[] = [];
        menuOptions.push({
            name: 'Mark as Complete',
            onPress: () => {
                closeMenu();
                toggleComplete();
            },
        });

        menuOptions.push({
            name: 'Mark as Incomplete',
            onPress: () => {
                closeMenu();
                toggleIncomplete();
            },
        });

        menuOptions.push({
            name: 'Mark as Failed',
            onPress: () => {
                closeMenu();
                toggleFailed();
            },
        });

        menuOptions.push({
            name: 'Delete',
            onPress: () => {
                closeMenu();
                toggleDeleted();
            },
            destructive: true,
        });
        dispatch(setMenuOptions(createEmbtrMenuOptions(menuOptions)));
    };

    const openMenu = useAppSelector(getOpenMenu);
    const closeMenu = useAppSelector(getCloseMenu);

    const onShortPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        updateMenuOptions();
        openMenu();
    };

    const onLongPress = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    };

    return (
        <View style={{ width: '97%' }}>
            <TouchableOpacity onPress={onShortPress} onLongPress={onLongPress}>
                <View style={[{ backgroundColor: isEnabled ? colors.button_background : colors.tomorrow_unselected, borderRadius: 15 }, CARD_SHADOW]}>
                    <View style={{ borderRadius: 15, flexDirection: 'row', overflow: 'hidden' }}>
                        <View
                            style={{
                                width: '2%',
                                height: '100%',
                                backgroundColor:
                                    plannedTask?.status === 'COMPLETE'
                                        ? colors.progress_bar_complete
                                        : plannedTask?.status === 'FAILED'
                                        ? colors.progress_bar_failed
                                        : 'gray',
                            }}
                        />

                        <View style={{ width: '98%', paddingTop: 5, paddingBottom: 5 }}>
                            <View style={{ paddingLeft: 10 }}>
                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                    <View style={{ flex: 1, flexDirection: 'row' }}>
                                        <Text
                                            style={{
                                                color: colors.goal_primary_font,
                                                fontFamily: 'Poppins_600SemiBold',
                                                fontSize: 14,
                                            }}
                                        >
                                            {plannedTask?.task?.title}
                                        </Text>
                                        <Text
                                            style={{
                                                color: colors.tab_selected,
                                                fontFamily: 'Poppins_400Regular',
                                                fontSize: 9,
                                                paddingStart: 5,
                                            }}
                                        >
                                            {/*plannedTask?.routine.id ? 'habit' : ''*/}
                                        </Text>
                                    </View>
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            flexDirection: 'row',
                                            paddingRight: 10,
                                        }}
                                    >
                                        <View>
                                            {plannedTask?.status === 'COMPLETE' ? (
                                                <TaskCompleteSymbol small={true} />
                                            ) : plannedTask?.status === 'FAILED' ? (
                                                <TaskFailedSymbol small={true} />
                                            ) : (
                                                <TaskInProgressSymbol small={true} />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View style={{ paddingTop: 8, marginLeft: 10, marginRight: 10 }}>
                                <HorizontalLine />
                            </View>

                            <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 2 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <Ionicons name={'time'} size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        filler 1
                                    </Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <MaterialCommunityIcons name="timer" size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        filler 2
                                    </Text>
                                </View>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <Ionicons name={'stats-chart-outline'} size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        filler 3
                                    </Text>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <MaterialCommunityIcons name="pillar" size={12} color={colors.goal_secondary_font} />
                                    <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: 'Poppins_400Regular', fontSize: 10 }}>
                                        filler 4
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
