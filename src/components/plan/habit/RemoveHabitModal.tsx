import { Modal, TouchableOpacity, View, Text, Pressable } from 'react-native';
import { getWindowHeight } from 'src/util/GeneralUtility';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ModalBase } from 'src/components/common/modal/ModalBase';
import {
    CARD_SHADOW,
    POPPINS_MEDIUM,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
    TIMELINE_CARD_PADDING,
} from 'src/util/constants';
import { PlannedHabitService } from 'src/service/PlannedHabitService';
import { SvgUri } from 'react-native-svg';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { PlannedTask } from 'resources/schema';
import {
    getRemovalModalPlannedTask,
    getSelectedDayKey,
    setRemovalModalPlannedTask,
} from 'src/redux/user/GlobalState';
import { Dispatch } from 'react';
import { AnyAction } from '@reduxjs/toolkit';
import { DEFAULT_UPDATE_MODAL_PLANNED_TASK } from 'src/model/GlobalState';
import PlannedDayController from 'src/controller/planning/PlannedDayController';

const isLargerScreen = getWindowHeight() > 800;
const buttonPadding = isLargerScreen ? 3 : 2;
const modalHeight = isLargerScreen ? getWindowHeight() / 3.5 : getWindowHeight() / 3;
const modalWidth = isLargerScreen ? getWindowHeight() / 3 : getWindowHeight() / 2.5;

const getBody = (
    plannedHabit: PlannedTask,
    dayKey: string,
    colors: any,
    onDismiss: (plannedTask?: PlannedTask) => void
) => {
    const svgUri = plannedHabit.iconUrl ?? '';

    const body = (
        <View style={{ flex: 1, alignItems: 'center' }}>
            {/* top section */}
            <View
                style={{
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <View
                    style={{
                        width: '100%',
                        flexDirection: 'row',
                        paddingTop: TIMELINE_CARD_PADDING,
                        paddingLeft: TIMELINE_CARD_PADDING,
                    }}
                >
                    <View style={{ height: 25, width: 25 }}>
                        <SvgUri width={25} height={25} uri={svgUri} />
                    </View>
                    <View style={{ width: TIMELINE_CARD_PADDING / 2 }} />
                    <View style={{ flex: 1 }}>
                        <Text
                            numberOfLines={1}
                            style={{
                                fontSize: 20,
                                width: '100%',
                                fontFamily: POPPINS_MEDIUM,
                                color: colors.accent_color,
                                paddingRight: TIMELINE_CARD_PADDING,
                            }}
                        >
                            {plannedHabit.title}
                        </Text>
                    </View>
                </View>
            </View>

            {/* middle section */}
            <View
                style={{
                    width: '100%',
                    flex: 1,
                    paddingTop: TIMELINE_CARD_PADDING,
                }}
            >
                <Text
                    style={{
                        fontSize: 12,
                        fontFamily: 'Poppins_400Regular',
                        paddingHorizontal: TIMELINE_CARD_PADDING,
                        color: colors.text,
                    }}
                >
                    <Text style={{ fontFamily: POPPINS_SEMI_BOLD }}>Remove this habit </Text>
                    from today or from your habit schedule. You can always add it back later.
                </Text>
            </View>

            {/* bottom section */}
            <View
                style={{
                    flex: 1,
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingHorizontal: TIMELINE_CARD_PADDING,
                }}
            >
                <TouchableOpacity
                    style={[
                        {
                            width: '100%',
                            backgroundColor: colors.toggle_color,
                            paddingVertical: 5,
                            borderRadius: 6,
                        },
                        CARD_SHADOW,
                    ]}
                    onPress={() => {
                        onDismiss();
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 14,
                            fontFamily: POPPINS_REGULAR,
                            color: colors.text,
                            paddingVertical: buttonPadding,
                        }}
                    >
                        Nevermind!
                    </Text>
                </TouchableOpacity>

                <View style={{ height: TIMELINE_CARD_PADDING }} />

                <TouchableOpacity
                    style={[
                        {
                            width: '100%',
                            backgroundColor: colors.accent_color,
                            paddingVertical: 5,
                            borderRadius: 6,
                        },
                        CARD_SHADOW,
                    ]}
                    onPress={async () => {
                        const clone = { ...plannedHabit };
                        clone.active = false;
                        onDismiss(clone);

                        await PlannedHabitService.deactivate(
                            {
                                ...plannedHabit,
                            },
                            dayKey
                        );

                        PlannedDayController.prefetchPlannedDayData(dayKey);
                    }}
                >
                    <Text
                        style={{
                            textAlign: 'center',
                            fontSize: 14,
                            fontFamily: POPPINS_REGULAR,
                            color: colors.text,
                            paddingVertical: buttonPadding,
                        }}
                    >
                        Remove For Today
                    </Text>
                </TouchableOpacity>

                <View style={{ height: TIMELINE_CARD_PADDING }} />
            </View>
        </View>
    );

    return body;
};

export const RemoveHabitModal = () => {
    const { colors } = useTheme();

    const dayKey = useAppSelector(getSelectedDayKey);
    const plannedHabitData = useAppSelector(getRemovalModalPlannedTask);
    const plannedHabit = plannedHabitData.plannedTask;
    const onUpdateCallback = plannedHabitData.callback;

    const dismiss = (updatedPlannedTask?: PlannedTask) => {
        dispatch(setRemovalModalPlannedTask(DEFAULT_UPDATE_MODAL_PLANNED_TASK));

        if (updatedPlannedTask) {
            onUpdateCallback(updatedPlannedTask);
        }
    };

    const dispatch = useAppDispatch();

    const visible = !!plannedHabit.title;

    return (
        <ModalBase visible={visible}>
            <Modal visible={visible} transparent={true} animationType={'fade'}>
                <Pressable
                    style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingBottom: '25%',
                    }}
                    onPress={(event) => {
                        if (event.target === event.currentTarget) {
                            dismiss();
                        }
                    }}
                >
                    <View
                        style={{
                            width: modalWidth,
                            height: modalHeight,
                            backgroundColor: colors.modal_background,
                            borderRadius: 7,
                            justifyContent: 'space-around',
                        }}
                    >
                        {getBody(plannedHabit, dayKey, colors, dismiss)}
                    </View>
                </Pressable>
            </Modal>
        </ModalBase>
    );
};
