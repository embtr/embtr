import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import Toast from 'react-native-root-toast';
import React, { useEffect } from 'react';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import {
    ChallengeReward,
    Habit,
    PlannedDay as PlannedDayModel,
    PlannedTask,
    Task,
    Unit,
} from 'resources/schema';
import TaskController from 'src/controller/planning/TaskController';
import { Ionicons } from '@expo/vector-icons';
import { DetailedTaskPreviewModal } from './DetailedTaskPreviewModal';
import { HabitIcon } from '../habit/HabitIcon';
import { SvgUri } from 'react-native-svg';
import { UnitUtility } from 'src/util/UnitUtility';

/* Pog I was here - Cherkim */

interface Props {
    plannedDay: PlannedDayModel;
    task: Task;
    habits: Habit[];
    challengeRewards: ChallengeReward[];
}

export const TaskPreview = ({ plannedDay, task, habits, challengeRewards }: Props) => {
    const { colors } = useTheme();

    const [isExpanded, setIsExpanded] = React.useState(false);
    const [selectedHabit, setSelectedHabit] = React.useState<Habit>();
    const [enteredQuantity, setEnteredQuantity] = React.useState<number>();
    const [selectedUnit, setSelectedUnit] = React.useState<Unit>();
    const [plannedTaskFromDatabase, setPlannedTaskFromDatabase] = React.useState<PlannedTask>();
    const [showSetUnitModal, setShowSetUnitModal] = React.useState<boolean>(false);
    const [showDetailedTaskPreviewModal, setShowDetailedTaskPreviewModal] =
        React.useState<boolean>(false);

    const selectedUnitValue = selectedUnit?.unit
        ? selectedUnit.unit.toString().toLowerCase()
        : 'Of What?';
    let capitalizedUnitValue =
        selectedUnitValue.charAt(0).toUpperCase() + selectedUnitValue.slice(1);
    capitalizedUnitValue += capitalizedUnitValue === 'Of What?' ? '' : 's';

    useEffect(() => {
        if (task?.taskPreference?.length) {
            setSelectedHabit(task.taskPreference[0].habit);
            setSelectedUnit(task.taskPreference[0].unit);
            setEnteredQuantity(task.taskPreference[0].quantity);
        }
    }, []);

    const openModal = () => {
        setShowDetailedTaskPreviewModal(true);
    };

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
        <View style={{ width: '100%', alignItems: 'center' }}>
            <DetailedTaskPreviewModal
                key={task.id}
                plannedDay={plannedDay}
                task={task}
                habits={habits}
                selectedHabit={selectedHabit}
                selectedUnit={selectedUnit}
                enteredQuantity={enteredQuantity}
                challengeRewards={challengeRewards}
                visible={showDetailedTaskPreviewModal}
                onDismiss={() => {
                    setShowDetailedTaskPreviewModal(false);
                }}
                onHabitChanged={(habit: Habit) => {
                    TaskController.updatePreference(task, habit, selectedUnit, enteredQuantity);
                    setSelectedHabit(habit);
                }}
                onUnitChanged={(unit: Unit) => {
                    setSelectedUnit(unit);
                }}
                onQuantityChanged={setEnteredQuantity}
            />
            <View style={{ width: '97%' }}>
                <View
                    style={[
                        { backgroundColor: colors.timeline_card_background, borderRadius: 9 },
                        CARD_SHADOW,
                    ]}
                >
                    <TouchableOpacity onPress={openModal}>
                        <View style={{ flexDirection: 'row' }}>
                            <View style={{ flex: 1 }}>
                                <View
                                    style={{
                                        paddingTop: 2.5,
                                        paddingLeft: 10,
                                        paddingBottom: 2.5,
                                    }}
                                >
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <View
                                            style={{
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <View style={{ flex: 1 }}>
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <Text
                                                        numberOfLines={1}
                                                        style={{
                                                            color: colors.goal_primary_font,
                                                            fontFamily: POPPINS_MEDIUM,
                                                            includeFontPadding: false,
                                                            fontSize: 14,
                                                        }}
                                                    >
                                                        {task.title}
                                                    </Text>

                                                    <View
                                                        style={{
                                                            borderRadius: 5,
                                                            alignItems: 'flex-end',
                                                            justifyContent: 'center',
                                                            paddingLeft: 5,
                                                            paddingRight: 10,
                                                        }}
                                                    >
                                                        <Ionicons
                                                            name={
                                                                isExpanded
                                                                    ? 'chevron-up-outline'
                                                                    : 'chevron-down-outline'
                                                            }
                                                            size={18}
                                                            color={colors.secondary_text}
                                                        />
                                                    </View>
                                                </View>
                                                {(enteredQuantity || selectedUnit) && (
                                                    <Text
                                                        style={{
                                                            color: colors.secondary_text,
                                                            includeFontPadding: false,
                                                            fontFamily: POPPINS_REGULAR,
                                                            fontSize: 12,
                                                            bottom: 3,
                                                        }}
                                                    >
                                                        {enteredQuantity}{' '}
                                                        {selectedUnit &&
                                                            enteredQuantity &&
                                                            UnitUtility.getReadableUnit(
                                                                selectedUnit,
                                                                enteredQuantity
                                                            )}
                                                    </Text>
                                                )}
                                            </View>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    paddingTop: 5,
                                                    paddingBottom: 5,
                                                }}
                                            >
                                                <View style={{ paddingLeft: 10 }}>{addButton}</View>
                                            </View>
                                        </View>
                                    </View>

                                    {(selectedHabit?.iconName || challengeRewards.length > 0) && (
                                        <View
                                            style={{
                                                bottom: 5,
                                            }}
                                        >
                                            <View style={{ height: 5 }} />
                                            {selectedHabit?.iconName && (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                    }}
                                                >
                                                    <HabitIcon
                                                        habit={selectedHabit}
                                                        size={15}
                                                        color={colors.text}
                                                    />
                                                    <Text
                                                        style={{
                                                            color: colors.secondary_text,
                                                            includeFontPadding: false,
                                                            fontFamily: POPPINS_REGULAR,
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        {' Habit: '}
                                                        {selectedHabit.title}
                                                    </Text>
                                                </View>
                                            )}

                                            {challengeRewards.length > 0 && (
                                                <View
                                                    style={{
                                                        flexDirection: 'row',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <SvgUri
                                                        width={15}
                                                        height={15}
                                                        uri={challengeRewards[0].imageUrl ?? ''}
                                                    />

                                                    <Text
                                                        style={{
                                                            color: colors.secondary_text,
                                                            includeFontPadding: false,
                                                            fontFamily: POPPINS_REGULAR,
                                                            fontSize: 12,
                                                        }}
                                                    >
                                                        {' Challenge: '}
                                                        {challengeRewards[0].name}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};
