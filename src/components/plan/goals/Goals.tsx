import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Goal } from 'src/components/plan/goals/Goal';

export const Goals = () => {
    let goalViews: JSX.Element[] = [];
    goalViews.push(
        <View style={{ paddingBottom: 7.5, width: "100%", alignItems: "center" }}>
            <Goal />
        </View>
    );

    goalViews.push(
        <View style={{ paddingBottom: 7.5, width: "100%", alignItems: "center" }}>
            <Goal />
        </View>
    );

    goalViews.push(
        <View style={{ paddingBottom: 5, width: "100%", alignItems: "center" }}>
            <Goal />
        </View>
    );

    return (
        <View style={{ height: "100%", width: "100%" }}>

            <ScrollView style={{ paddingTop: 7 }}>
                {goalViews}
            </ScrollView>
        </View>
    );
};