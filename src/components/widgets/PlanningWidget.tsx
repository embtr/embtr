import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { Planning } from '../plan/planning/Planning';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { TodayTab } from 'src/navigation/RootStackParamList';

export const PlanningWidget = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<TodayTab>>();
    const navigateToAddTasks = () => {
        navigation.navigate('AddTasks');
    };

    return (
        <WidgetBase menuOptions={[]} symbol="add-outline" onPressSymbol={navigateToAddTasks}>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    Planning
                </Text>

                <View style={{ paddingTop: 5 }}>
                    <Planning />
                </View>
            </View>
        </WidgetBase>
    );
};
