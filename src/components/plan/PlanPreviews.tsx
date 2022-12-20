import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { HabitsPreview } from './HabitsPreview';

export const PlanPreviews = () => {
    const { colors } = useTheme();

    return (
        <View style={{ height: '100%' }}>
            <ScrollView style={{ backgroundColor: colors.background, paddingTop: 7 }}>
                <HabitsPreview />
                <HabitsPreview />
            </ScrollView>
        </View>
    );
};
