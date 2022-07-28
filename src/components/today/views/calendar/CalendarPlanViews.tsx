import React from 'react';
import { LayoutRectangle, View } from 'react-native';
import { CalendarPlanView } from 'src/components/today/views/calendar/CalendarPlanView';
import { GuestCalendarPlanView } from 'src/components/today/views/calendar/GuestCalendarPlanView';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { UserType } from 'src/controller/profile/ProfileController';

interface Props {
    plannedToday?: PlannedDay
    updateTask?: Function,
    userType: UserType
}

export const CalendarPlanViews = ({ plannedToday, updateTask, userType }: Props) => {
    const [layout, setLayout] = React.useState<LayoutRectangle>();

    let planViews: JSX.Element[] = [];
    plannedToday?.plannedTasks.forEach(plannedTask => {
        planViews.push(
            <View key={plannedTask.id} style={{ alignContent: "flex-end", alignItems: "flex-end" }} >
                {
                    userType === UserType.USER && updateTask ?
                        <CalendarPlanView plannedTask={plannedTask} onUpdateTask={updateTask} parentLayout={layout} />
                        :
                        <GuestCalendarPlanView plannedTask={plannedTask} />
                }

            </View>
        );
    });

    return (
        <View onLayout={(event) => { setLayout(event.nativeEvent.layout) }} style={{ zIndex: 2, position: "absolute", height: "100%", width: "100%", paddingRight: 30 }}>
            {planViews}
        </View>
    );
};