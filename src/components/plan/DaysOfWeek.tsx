import React from 'react';
import { View, Text } from 'react-native';
import { DaysModel } from 'src/controller/planning/TaskController';

interface Props {
    days: DaysModel
}

const selected: string = "#00FF00";
const unselected: string = "gray";

export const DaysOfWeek = ({ days }: Props) => {

    return (
        <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <Text style={{ color: days.sunday ? selected : unselected }}> S </Text>
            <Text style={{ color: days.monday ? selected : unselected }}> M </Text>
            <Text style={{ color: days.tuesday ? selected : unselected }}> T </Text>
            <Text style={{ color: days.wednesday ? selected : unselected }}> W </Text>
            <Text style={{ color: days.thursday ? selected : unselected }}> T </Text>
            <Text style={{ color: days.friday ? selected : unselected }}> F </Text>
            <Text style={{ color: days.saturday ? selected : unselected }}> S </Text>
        </View>
    );
};