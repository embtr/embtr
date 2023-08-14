import { View, Text, TextInput } from 'react-native';
import { ChallengeReward, PlannedDay, PlannedTask, Task, Unit } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import React from 'react';
import { SlideUpModal } from 'src/components/common/modal/SlideUpModal';
import { POPPINS_SEMI_BOLD, POPPINS_MEDIUM } from 'src/util/constants';
import { AndroidUnitPicker } from 'src/components/units/AndroidUnitPicker';
import { IOSUnitPicker } from 'src/components/units/IOSUnitPicker';
import { isAndroidDevice } from 'src/util/DeviceUtil';
import { AddTaskButton } from './AddTaskButton';

interface Props {
    plannedDay: PlannedDay;
    task: Task;
    challengeRewards: ChallengeReward[];
    visible: boolean;
    onDismiss: Function;
    selectedUnit?: Unit;
    enteredQuantity?: number;
    onUnitChanged: Function;
    onQuantityChanged: Function;
}

export const DetailedTaskPreviewModal = ({
    plannedDay,
    task,
    challengeRewards,
    visible,
    onDismiss,
    selectedUnit,
    enteredQuantity,
    onUnitChanged,
    onQuantityChanged,
}: Props) => {
    const { colors } = useTheme();
    const [plannedTaskFromDatabase, setPlannedTaskFromDatabase] = React.useState<PlannedTask>();
    const [showSetUnitModal, setShowSetUnitModal] = React.useState<boolean>(false);
    const [saveDetails, setSaveDetails] = React.useState<boolean>(false);

    const selectedUnitValue = selectedUnit?.unit
        ? selectedUnit.unit.toString().toLowerCase()
        : 'Of What?';
    let capitalizedUnitValue =
        selectedUnitValue.charAt(0).toUpperCase() + selectedUnitValue.slice(1);
    capitalizedUnitValue += capitalizedUnitValue === 'Of What?' ? '' : 's';

    const PADDING = 12.5;

    return (
        <SlideUpModal visible={visible} onDismiss={onDismiss}>
            {isAndroidDevice() ? (
                <AndroidUnitPicker
                    defaultUnit={selectedUnit}
                    visible={showSetUnitModal}
                    confirm={(selected: Unit) => {
                        setShowSetUnitModal(false);
                        onUnitChanged(selected);
                    }}
                    dismiss={() => {
                        setShowSetUnitModal(false);
                    }}
                />
            ) : (
                <IOSUnitPicker
                    defaultUnit={selectedUnit}
                    visible={showSetUnitModal}
                    confirm={(selected: Unit) => {
                        setShowSetUnitModal(false);
                        onUnitChanged(selected);
                    }}
                    dismiss={() => {
                        setShowSetUnitModal(false);
                    }}
                />
            )}
            <View style={{ paddingLeft: PADDING, paddingTop: 5, width: '100%' }}>
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
                </View>

                <View style={{ paddingTop: 20 }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}
                    >
                        <Text
                            style={{
                                flex: 1,
                                color: colors.secondary_text,
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 12,
                                includeFontPadding: false,
                            }}
                        >
                            Details
                        </Text>
                    </View>
                </View>
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
                            paddingRight: PADDING,
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
                                onQuantityChanged(parseInt(text));
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
                            paddingRight: PADDING,
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

            <View
                style={{
                    alignItems: 'center',
                    width: '100%',
                    paddingHorizontal: PADDING,
                    paddingTop: 10,
                }}
            >
                <AddTaskButton
                    task={task}
                    plannedDay={plannedDay}
                    setPlannedTaskFromDatabase={setPlannedTaskFromDatabase}
                    unit={selectedUnit}
                    quantity={enteredQuantity}
                    onPressed={() => {
                        onDismiss();
                    }}
                />
            </View>
        </SlideUpModal>
    );
};
