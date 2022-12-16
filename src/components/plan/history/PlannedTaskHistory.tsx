import { View, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { PlannedTaskHistoryElement } from './PlannedTaskHistoryElement';

interface Props {
    history: PlannedTaskModel[];
}

export const PlannedTaskHistory = ({ history }: Props) => {
    const { colors } = useTheme();

    let historyViews: JSX.Element[] = [];
    history.forEach((task) => {
        historyViews.push(
            <View key={task.id} style={{ paddingTop: 5 }}>
                <PlannedTaskHistoryElement history={task} />
            </View>
        );
    });

    return (
        <View style={{ flex: 1 }}>
            <View style={{ paddingTop: 20, width: '100%' }}>
                <Text style={{ fontFamily: POPPINS_SEMI_BOLD, color: colors.goal_primary_font, paddingLeft: 7 }}>History</Text>
            </View>
            <ScrollView>{historyViews}</ScrollView>
        </View>
    );
};
