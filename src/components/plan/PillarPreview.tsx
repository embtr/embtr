import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PillarModel } from 'src/model/PillarModel';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns';
import React from 'react';
import PlannedTaskController, { getLongestStreak, PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { CARD_SHADOW, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    pillar: PillarModel;
}

export const PillarPreview = ({ pillar }: Props) => {
    const { colors } = useTheme();

    const [pillarHistory, setPillarHistory] = React.useState<PlannedTaskModel[]>([]);
    React.useEffect(() => {
        const fetch = async () => {
            if (pillar.id) {
                const pillarHistory = await PlannedTaskController.getPillarHistory(pillar.id);
                setPillarHistory(pillarHistory);
            }
        };

        fetch();
    }, [pillar]);

    const totalUsage = pillarHistory.length;
    const longestStreak = getLongestStreak(pillarHistory);

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();
    const navigateToDetails = () => {
        navigation.navigate('PillarDetails', { uid: pillar.uid, id: pillar.id! });
    };

    return (
        <View style={{ width: '97%' }}>
            <TouchableWithoutFeedback onPress={navigateToDetails}>
                <View style={[{ backgroundColor: colors.timeline_card_background, borderRadius: 9 }, CARD_SHADOW]}>
                    <View style={[{ flexDirection: 'row' }]}>
                        <View style={{ flex: 1 }}>
                            <View style={{ paddingLeft: 10 }}>
                                <Text style={{ color: colors.goal_primary_font, fontFamily: POPPINS_SEMI_BOLD, fontSize: 14 }}>{pillar.name}</Text>
                            </View>

                            <View style={{ flexDirection: 'row', width: '100%', paddingTop: 2 }}>
                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                                    <Ionicons name={'calendar-outline'} size={20} color={colors.profile_pillar_attribute_icon} />
                                    <View style={{ paddingLeft: 5 }}>
                                        <Text
                                            style={{
                                                fontSize: 10,
                                                fontFamily: 'Poppins_400Regular',
                                                color: colors.profile_pillar_attribute_name,
                                                opacity: 0.8,
                                            }}
                                        >
                                            Created
                                        </Text>
                                        <Text style={{ fontSize: 11, fontFamily: 'Poppins_400Regular', color: colors.tab_selected }}>
                                            {format(pillar.added.toDate(), 'MMM dd, yyyy')}
                                        </Text>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <FontAwesome name="tasks" size={20} color={colors.profile_pillar_attribute_icon} />
                                    <View style={{ paddingLeft: 5 }}>
                                        <Text
                                            style={{
                                                fontSize: 10,
                                                fontFamily: 'Poppins_400Regular',
                                                color: colors.profile_pillar_attribute_name,
                                                opacity: 0.8,
                                            }}
                                        >
                                            Tasks Completed
                                        </Text>
                                        <Text style={{ fontSize: 11, fontFamily: 'Poppins_400Regular', color: '#c809eb' }}>{totalUsage}</Text>
                                    </View>
                                </View>

                                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    <Ionicons name={'trophy-outline'} size={20} color={colors.profile_pillar_attribute_icon} />
                                    <View style={{ paddingLeft: 5 }}>
                                        <Text
                                            style={{
                                                fontSize: 10,
                                                fontFamily: 'Poppins_400Regular',
                                                color: colors.profile_pillar_attribute_name,
                                                opacity: 0.8,
                                            }}
                                        >
                                            Longest Streak
                                        </Text>
                                        <Text style={{ fontSize: 11, fontFamily: 'Poppins_400Regular', color: colors.progress_bar_complete }}>
                                            {longestStreak}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};
