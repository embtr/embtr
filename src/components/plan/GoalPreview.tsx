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

interface Props {
    goal: GoalModel;
    pillars: PillarModel[];
}

export const GoalPreview = ({ goal, pillars }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const navigateToDetails = () => {
        navigation.navigate('GoalDetails', { id: goal.id! });
    };

    let pillarName = '';
    pillars.forEach((pillar) => {
        if (goal?.pillarId === pillar.id) {
            pillarName = pillar.name;
            return;
        }
    });

    const progressPercent = getProgressPercent(goal);

    return (
        <View style={{ width: '97%' }}>
            <TouchableWithoutFeedback onPress={navigateToDetails}>
                <View style={[{ backgroundColor: colors.timeline_card_background, borderRadius: 9 }, CARD_SHADOW]}>
                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text style={{ color: colors.goal_primary_font, fontFamily: POPPINS_SEMI_BOLD, fontSize: 14 }}>{goal.name}</Text>
                            <Text style={{ color: colors.goal_secondary_font, opacity: .90, fontFamily: POPPINS_REGULAR, fontSize: 10 }}>{goal.description}</Text>
                        </View>

                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <ProgressBar progress={progressPercent} />
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="pillar" size={12} color={colors.tab_selected} />
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        color: colors.goal_secondary_font,
                                        opacity: pillarName ? 1 : 0.5,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 10,
                                    }}
                                >
                                    {pillarName ? pillarName : 'no pillar'}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};
