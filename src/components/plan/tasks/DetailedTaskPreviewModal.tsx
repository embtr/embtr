import { TouchableOpacity, View, Text, PanResponder, TextInput } from 'react-native';
import { ChallengeReward, Habit, PlannedDay, PlannedTask, Task, Unit } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import React from 'react';
import { SlideUpModal } from 'src/components/common/modal/SlideUpModal';
import { POPPINS_SEMI_BOLD, POPPINS_MEDIUM } from 'src/util/constants';
import { HabitScrollSelector } from './HabitScrollSelector';
import TaskController from 'src/controller/planning/TaskController';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import Toast from 'react-native-root-toast';
import { AndroidUnitPicker } from 'src/components/units/AndroidUnitPicker';
import { IOSUnitPicker } from 'src/components/units/IOSUnitPicker';
import { isAndroidDevice } from 'src/util/DeviceUtil';

interface Props {
    plannedDay: PlannedDay;
    task: Task;
    habits: Habit[];
    challengeRewards: ChallengeReward[];
    visible: boolean;
    onDismiss: Function;
}

export const DetailedTaskPreviewModal = ({
    plannedDay,
    task,
    habits,
    challengeRewards,
    visible,
    onDismiss,
}: Props) => {
    const { colors } = useTheme();

    const [selectedHabit, setSelectedHabit] = React.useState<Habit>();
    const [enteredQuantity, setEnteredQuantity] = React.useState<number>();
    const [selectedUnit, setSelectedUnit] = React.useState<Unit>();
    const [plannedTaskFromDatabase, setPlannedTaskFromDatabase] = React.useState<PlannedTask>();
    const [showSetUnitModal, setShowSetUnitModal] = React.useState<boolean>(false);

    const selectedUnitValue = selectedUnit?.unit
        ? selectedUnit.unit.toString().toLowerCase()
        : 'Of What?';
    let capitalizedUnitValue =
        selectedUnitValue.charAt(0).toUpperCase() + selectedUnitValue.slice(1);
    capitalizedUnitValue += capitalizedUnitValue === 'Of What?' ? '' : 's';

    const onHabitSelected = async (habit: Habit) => {
        setSelectedHabit(habit);
        TaskController.updateHabitPreference(task, habit);
    };

    const onHandleDismiss = () => {
        onDismiss();
    };

    const panResponder = React.useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => false,
            onPanResponderMove: (_, gestureState) => {
                // Close the modal if the user swipes down beyond a certain threshold
                if (gestureState.dy > 50) {
                    onHandleDismiss();
                }
            },
            onPanResponderRelease: () => {},
            onPanResponderTerminate: () => {},
        })
    ).current;

    const addButton = (
        <View
            style={{
                paddingRight: 10,
                width: 75,
            }}
        >
            <TouchableOpacity
                onPress={async () => {
                    let taskToAdd = task;

                    if (!task.id) {
                        taskToAdd = await TaskController.createViaApi(task.title!);
                    }

                    const created = await PlannedTaskController.addTaskViaApi(
                        plannedDay,
                        taskToAdd,
                        selectedHabit,
                        selectedUnit,
                        enteredQuantity
                    );
                    setPlannedTaskFromDatabase(created.plannedTask);

                    Toast.show('task added!', {
                        duration: Toast.durations.LONG,
                    });
                }}
            >
                <View
                    style={{
                        borderRadius: 7,
                        backgroundColor: '#27B24A',
                        alignItems: 'center',
                        paddingVertical: 3,
                        marginVertical: 1,
                    }}
                >
                    <Text
                        style={{
                            color: colors.text,
                            fontFamily: POPPINS_MEDIUM,
                            top: 1.5,
                        }}
                    >
                        Add
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );

    return (
        <SlideUpModal visible={visible} onDismiss={onDismiss}>
            {isAndroidDevice() ? (
                <AndroidUnitPicker
                    visible={showSetUnitModal}
                    confirm={(selected: Unit) => {
                        setShowSetUnitModal(false);
                        setSelectedUnit(selected);
                    }}
                    dismiss={() => {
                        setShowSetUnitModal(false);
                    }}
                />
            ) : (
                <IOSUnitPicker
                    visible={showSetUnitModal}
                    confirm={(selected: Unit) => {
                        setShowSetUnitModal(false);
                        setSelectedUnit(selected);
                    }}
                    dismiss={() => {
                        setShowSetUnitModal(false);
                    }}
                />
            )}
            <View style={{ paddingLeft: 15, paddingTop: 5 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}
                >
                    <Text
                        numberOfLines={1}
                        style={{
                            flex: 1,
                            color: colors.goal_primary_font,
                            fontFamily: POPPINS_MEDIUM,
                            includeFontPadding: false,
                            fontSize: 20,
                        }}
                    >
                        {task.title}
                    </Text>
                    {addButton}
                </View>
                {/* Select A Habit */}
                <View style={{ paddingTop: 10 }}>
                    <Text
                        style={{
                            color: colors.secondary_text,
                            fontFamily: POPPINS_SEMI_BOLD,
                            fontSize: 12,
                        }}
                    >
                        Select a Habit
                    </Text>
                    <View style={{ height: 50 }}>
                        <HabitScrollSelector
                            habits={habits}
                            initialHabit={selectedHabit}
                            onHabitSelected={onHabitSelected}
                        />
                    </View>
                </View>

                <Text
                    style={{
                        color: colors.secondary_text,
                        paddingTop: 20,
                        fontFamily: POPPINS_SEMI_BOLD,
                        fontSize: 12,
                    }}
                >
                    Details
                </Text>
                <View
                    style={{
                        flexDirection: 'row',
                        paddingTop: 5,
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            flex: 1,
                            flexDirection: 'row',
                        }}
                    >
                        <Text
                            onPress={() => {
                                setShowSetUnitModal(true);
                            }}
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                            }}
                        >
                            Quantity
                        </Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            paddingRight: 10,
                            flexDirection: 'row',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <TextInput
                            keyboardType="numeric"
                            style={{
                                textAlign: 'right',
                                borderWidth: 1,
                                borderColor: colors.secondary_text,
                                borderRadius: 5,
                                fontFamily: 'Poppins_400Regular',
                                color: colors.text,
                                paddingTop: 6,
                                paddingBottom: 6,
                                paddingLeft: 25,
                                paddingRight: 5,
                                width: '60%',
                            }}
                            placeholder={'how many?'}
                            placeholderTextColor={colors.secondary_text}
                            autoCorrect={true}
                            onChangeText={(text) => {
                                setEnteredQuantity(parseInt(text));
                            }}
                            value={enteredQuantity?.toString()}
                        />
                    </View>
                </View>
                <View style={{ flexDirection: 'row', paddingTop: 10 }}>
                    <View
                        style={{
                            alignItems: 'center',
                            flex: 1,
                            paddingLeft: 10,
                            flexDirection: 'row',
                        }}
                    >
                        <Text
                            onPress={() => {
                                setShowSetUnitModal(true);
                            }}
                            style={{
                                color: colors.text,
                                fontFamily: POPPINS_MEDIUM,
                            }}
                        >
                            Units
                        </Text>
                    </View>
                    <View
                        style={{
                            justifyContent: 'flex-end',
                            flex: 1,
                            paddingRight: 10,
                            flexDirection: 'row',
                        }}
                    >
                        <Text
                            onPress={() => {
                                setShowSetUnitModal(true);
                            }}
                            style={{
                                textAlign: 'right',
                                borderWidth: 1,
                                borderColor: colors.secondary_text,
                                borderRadius: 5,
                                fontFamily: 'Poppins_400Regular',
                                color: selectedUnit ? colors.text : colors.secondary_text,
                                paddingTop: 8,
                                paddingBottom: 4,
                                paddingLeft: 25,
                                paddingRight: 5,
                                width: '60%',
                            }}
                        >
                            {capitalizedUnitValue}
                        </Text>
                    </View>
                </View>
            </View>
        </SlideUpModal>
    );
};
