import React from 'react';
import { View } from 'react-native';
import { SelectableDayOfWeek } from 'src/components/plan/task/SelectableDayOfWeek';
import { createDays, DaysModel } from 'src/controller/planning/TaskController';

interface Props {
    daysOfWeek: DaysModel
    onDaysOfWeekUpdated: Function
}

export const SelectableDaysOfWeek = ({ daysOfWeek, onDaysOfWeekUpdated }: Props) => {

    const updateDayOfWeekSelected = (dayOfWeek: string, selected: boolean) => {
        let updatedDaysOfWeek = createDays(daysOfWeek.sunday, daysOfWeek.monday, daysOfWeek.tuesday, daysOfWeek.wednesday, daysOfWeek.thursday, daysOfWeek.friday, daysOfWeek.saturday);
        switch (dayOfWeek) {
            case "sunday": updatedDaysOfWeek.sunday = selected; break;
            case "monday": updatedDaysOfWeek.monday = selected; break;
            case "tuesday": updatedDaysOfWeek.tuesday = selected; break;
            case "wednesday": updatedDaysOfWeek.wednesday = selected; break;
            case "thursday": updatedDaysOfWeek.thursday = selected; break;
            case "friday": updatedDaysOfWeek.friday = selected; break;
            case "saturday": updatedDaysOfWeek.saturday = selected; break;
        }

        onDaysOfWeekUpdated(updatedDaysOfWeek);
    }

    return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"S"} selected={daysOfWeek.sunday} onPress={() => { updateDayOfWeekSelected("sunday", !daysOfWeek.sunday) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"M"} selected={daysOfWeek.monday} onPress={() => { updateDayOfWeekSelected("monday", !daysOfWeek.monday) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"T"} selected={daysOfWeek.tuesday} onPress={() => { updateDayOfWeekSelected("tuesday", !daysOfWeek.tuesday) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"W"} selected={daysOfWeek.wednesday} onPress={() => { updateDayOfWeekSelected("wednesday", !daysOfWeek.wednesday) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"T"} selected={daysOfWeek.thursday} onPress={() => { updateDayOfWeekSelected("thursday", !daysOfWeek.thursday) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"F"} selected={daysOfWeek.friday} onPress={() => { updateDayOfWeekSelected("friday", !daysOfWeek.friday) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"S"} selected={daysOfWeek.saturday} onPress={() => { updateDayOfWeekSelected("saturday", !daysOfWeek.saturday) }} /></View>
        </View>
    );
};