import React from 'react';
import { LayoutRectangle, View } from 'react-native';
import { CalendarPlanView } from 'src/components/today/views/calendar/CalendarPlanView';
import { CalendarPlanViewGroup, GeneratePlanViewGroups } from 'src/components/today/views/calendar/CalendarPlanViewGroup';
import { GuestCalendarPlanView } from 'src/components/today/views/calendar/GuestCalendarPlanView';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { UserType } from 'src/controller/profile/ProfileController';

interface Props {
    plannedToday?: PlannedDay;
    updateTask?: Function;
    userType: UserType;
}

export const CalendarPlanViews = ({ plannedToday, updateTask, userType }: Props) => {
    const [layout, setLayout] = React.useState<LayoutRectangle>();

    let generatedGroups: CalendarPlanViewGroup[] = [];
    if (plannedToday?.plannedTasks) {
        generatedGroups = GeneratePlanViewGroups(plannedToday?.plannedTasks);
    }

    let planViews: JSX.Element[] = [];
    generatedGroups.forEach((group) => {
        const tasks = group.getTasks();
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i];

            planViews.push(
                userType === UserType.USER && updateTask ? (
                    <CalendarPlanView key={task.id} plannedTask={task} onUpdateTask={updateTask} rowIndex={i} totalInRow={tasks.length} parentLayout={layout} />
                ) : (
                    <GuestCalendarPlanView key={task.id} plannedTask={task} rowIndex={i} totalInRow={tasks.length} parentLayout={layout} />
                )
            );
        }
    });

    return (
        <View
            onLayout={(event) => {
                setLayout(event.nativeEvent.layout);
            }}
            style={{ zIndex: 2, position: 'absolute', height: '100%', width: '100%' }}
        >
            {planViews}
        </View>
    );
};
