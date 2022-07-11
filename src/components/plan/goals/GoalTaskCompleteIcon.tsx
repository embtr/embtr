import React from 'react';
import { View, Text } from 'react-native';

export const GoalTaskCompleteIcon = () => {
    return (
        <View style={{ width: 30, height: 30, borderWidth: 3, borderColor: "green", borderRadius: 5, alignItems: "center", justifyContent: "center" }}>
            <Text style={{ color: "green", fontWeight: "bold", fontSize: 16 }}>✓</Text>
        </View>
    );
};