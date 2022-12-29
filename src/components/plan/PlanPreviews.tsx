import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { GoalPreviews } from './GoalPreviews';
import { HabitPreviews } from './HabitPreviews';
import { PillarPreviews } from './PillarPreviews';
import { RoutinePreviews } from './routines/RoutinePreviews';

export const PlanPreviews = () => {
    const { colors } = useTheme();

    return (
        <View style={{ height: '100%' }}>
            <ScrollView style={{ backgroundColor: colors.background, paddingTop: 7 }}>
                <View style={{ paddingTop: 10 }} />
                <HabitPreviews />

                <View style={{ paddingTop: 10 }} />
                <RoutinePreviews />

                <View style={{ paddingTop: 20 }} />
                <GoalPreviews />

                <View style={{ paddingTop: 20 }} />
                <PillarPreviews />

                <View style={{ paddingTop: 10 }} />
            </ScrollView>
        </View>
    );
};
