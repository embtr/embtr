import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { getProgressPercent, GoalModel } from 'src/controller/planning/GoalController';
import { PillarModel } from 'src/model/PillarModel';
import { ProgressBar } from './goals/ProgressBar';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';

interface Props {
    pillar: PillarModel;
}

export const PillarPreview = ({ pillar }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();
    PlannedTaskController.getGoalHistory;

    const navigateToDetails = () => {
        //navigation.navigate('GoalDetails', { id: goal.id! });
    };

    return (
        <View style={{ width: '97%' }}>
            <TouchableWithoutFeedback onPress={navigateToDetails}>
                <View style={[{ backgroundColor: colors.button_background, borderRadius: 9 }, CARD_SHADOW]}>
                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text style={{ color: colors.goal_primary_font, fontFamily: POPPINS_SEMI_BOLD, fontSize: 14 }}>{pillar.name}</Text>
                            <Text style={{ color: colors.goal_secondary_font, fontFamily: POPPINS_REGULAR, fontSize: 10 }}>{}</Text>
                        </View>

                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: POPPINS_REGULAR, fontSize: 10 }}>
                                Added in Jan. of 2022
                                </Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: POPPINS_REGULAR, fontSize: 10 }}>
                                    25 tasks this year
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};
