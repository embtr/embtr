import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { PlannedDay } from 'src/controller/planning/PlannedDayController';
import { MainTabScreens } from 'src/navigation/RootStackParamList';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { DailyResultCardElement } from '../common/timeline/DailyResultCardElement';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';

interface Props {
    plannedDay: PlannedDay;
    togglePlannedTask?: Function;
}

export const TodaysTasksWidget = ({ plannedDay, togglePlannedTask }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<MainTabScreens>>();

    let plannedTaskViews: JSX.Element[] = [];
    plannedDay?.plannedTasks.forEach((plannedTask) => {
        plannedTaskViews.push(
            <View key={plannedTask.id} style={{ paddingBottom: 5 }}>
                <DailyResultCardElement plannedTask={plannedTask} onPress={togglePlannedTask} />
            </View>
        );
    });

    const isGuest = togglePlannedTask === undefined;

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Today's Tasks</Text>
            {plannedTaskViews.length > 0 && <View style={{ paddingLeft: 10, paddingTop: 15 }}>{plannedTaskViews}</View>}
            {plannedTaskViews.length === 0 && (
                <View style={{ paddingTop: 5 }}>
                    {isGuest ? (
                        <Text style={{ color: colors.text }}>
                            It appears that today is a <Text style={{ color: colors.tab_selected }}>rest day</Text>.
                        </Text>
                    ) : (
                        <Text style={{ color: colors.text }}>
                            you have an empty plate -{' '}
                            <Text
                                onPress={() => {
                                    if (plannedDay?.id) {
                                        navigation.navigate('PlanTab', { screen: 'PlanMain' });
                                    }
                                }}
                                style={{ color: colors.tab_selected, fontFamily: 'Poppins_400Regular' }}
                            >
                                plan your day
                            </Text>
                        </Text>
                    )}
                </View>
            )}
        </WidgetBase>
    );
};
