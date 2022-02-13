import React from 'react';
import { View } from 'react-native';
import { SelectableDayOfWeek } from 'src/components/plan/routine/SelectableDayOfWeek';

export const SelectableDaysOfWeek = () => {
    const [mondayIsSelected, setMondayIsSelected] = React.useState(false);
    const [tuesdayIsSelected, setTuesdayIsSelected] = React.useState(false);
    const [wednesdayIsSelected, setWednesdayIsSelected] = React.useState(false);
    const [thursdayIsSelected, setThursdayIsSelected] = React.useState(false);
    const [fridayIsSelected, setFridayIsSelected] = React.useState(false);
    const [saturdayIsSelected, setSaturdayIsSelected] = React.useState(false);
    const [sundayIsSelected, setSundayIsSelected] = React.useState(false);

    return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"S"} selected={sundayIsSelected} onPress={() => { setSundayIsSelected(!sundayIsSelected) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"M"} selected={mondayIsSelected} onPress={() => { setMondayIsSelected(!mondayIsSelected) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"T"} selected={tuesdayIsSelected} onPress={() => { setTuesdayIsSelected(!tuesdayIsSelected) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"W"} selected={wednesdayIsSelected} onPress={() => { setWednesdayIsSelected(!wednesdayIsSelected) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"T"} selected={thursdayIsSelected} onPress={() => { setThursdayIsSelected(!thursdayIsSelected) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"F"} selected={fridayIsSelected} onPress={() => { setFridayIsSelected(!fridayIsSelected) }} /></View>
            <View style={{ padding: 2 }}><SelectableDayOfWeek day={"S"} selected={saturdayIsSelected} onPress={() => { setSaturdayIsSelected(!saturdayIsSelected) }} /></View>
        </View>
    );
};