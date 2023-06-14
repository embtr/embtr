import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import React from 'react';
import { getTodayKey, getDayKey } from 'src/controller/planning/PlannedDayController';
import { Planning } from '../plan/planning/Planning';

export const PlanningWidget = () => {
    const { colors } = useTheme();

    const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);
    const [selectedDayKey, setSelectedDayKey] = React.useState<string>(getTodayKey());

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        setSelectedDayKey(newDayKey);
    };

    return (
        <WidgetBase
            menuOptions={[]}
            symbol="add-outline"
            onPressSymbol={() => {
                setShowAddTaskModal(true);
            }}
        >
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    Planning
                </Text>

                <View style={{ paddingTop: 5 }}>
                    <Planning
                        showSelectTaskModal={showAddTaskModal}
                        setShowSelectTaskModal={setShowAddTaskModal}
                        dismissSelectTaskModal={() => {
                            setShowAddTaskModal(false);
                        }}
                        onDayChange={onDayChanged}
                        selectedDayKey={selectedDayKey}
                        useCalendarView={false}
                    />
                </View>
            </View>
        </WidgetBase>
    );
};
