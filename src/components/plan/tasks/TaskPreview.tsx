import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { TaskModel } from 'resources/models';

interface Props {
    task: TaskModel;
}

export const TaskPreview = ({ task }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const navigateToDetails = () => {};

    return (
        <View style={{ width: '97%' }}>
            <TouchableWithoutFeedback onPress={navigateToDetails}>
                <View style={[{ backgroundColor: colors.timeline_card_background, borderRadius: 9 }, CARD_SHADOW]}>
                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text style={{ color: colors.goal_primary_font, fontFamily: POPPINS_SEMI_BOLD, fontSize: 14 }}>{task.title}</Text>
                            <Text style={{ color: colors.goal_secondary_font, opacity: 0.9, fontFamily: POPPINS_REGULAR, fontSize: 10 }}>
                                {task.description}
                            </Text>
                        </View>

                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Ionicons name={'stats-chart-outline'} size={12} color={colors.tab_selected} />
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        color: colors.goal_secondary_font,
                                        opacity: task.title ? 1 : 0.5,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 10,
                                    }}
                                >
                                    'no goal'
                                </Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <MaterialCommunityIcons name="pillar" size={12} color={colors.tab_selected} />
                                <Text
                                    style={{
                                        paddingLeft: 5,
                                        color: colors.goal_secondary_font,
                                        opacity: task ? 1 : 0.5,
                                        fontFamily: POPPINS_REGULAR,
                                        fontSize: 10,
                                    }}
                                >
                                    no pillar
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};
