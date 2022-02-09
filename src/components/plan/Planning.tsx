import React from 'react';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Banner } from 'src/components/common/Banner';
import { Screen } from 'src/components/common/Screen';
import { Plan } from 'src/components/plan/Plan';
import { PlanningSummaryHeader } from 'src/components/plan/PlanningSummaryHeader';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const Planning = () => {
    const { colors } = useTheme();
    
    return (
        <Screen>
            <Banner name="Planning" />
            <PlanningSummaryHeader />
            <ScrollView style={{ backgroundColor: colors.background }}>
                <View style={{ paddingBottom: 5 }}>
                    <Plan name={"Workout"} />
                </View>
                <View style={{ paddingBottom: 5 }}>
                    <Plan name={"Read"} />
                </View>
                <View style={{ paddingBottom: 5 }}>
                    <Plan name={"Program"} />
                </View>
                <View style={{ paddingBottom: 5 }}>
                    <Plan name={"Watch TV"} />
                </View>
            </ScrollView>
        </Screen>
    );
};