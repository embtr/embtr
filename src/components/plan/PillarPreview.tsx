import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR, POPPINS_SEMI_BOLD } from 'src/util/constants';
import { PillarModel } from 'src/model/PillarModel';
import PlannedTaskController, { PlannedTaskModel } from 'src/controller/planning/PlannedTaskController';
import { formatDistance } from 'date-fns';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    pillar: PillarModel;
}

export const PillarPreview = ({ pillar }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const navigateToDetails = () => {
        navigation.navigate('PillarDetails', { uid: pillar.uid, id: pillar.id! });
    };

    const daysOld = formatDistance(pillar.added.toDate(), new Date());

    const [pillarHistory, setPillarHistory] = React.useState<PlannedTaskModel[]>([]);
    React.useEffect(() => {
        const fetch = async () => {
            if (pillar.id) {
                const pillarHistory = await PlannedTaskController.getPillarHistory(pillar.id);
                setPillarHistory(pillarHistory);
            }
        };

        fetch();
    }, []);

    const timesUsed = pillarHistory.length;

    return (
        <View style={{ width: '97%' }}>
            <TouchableWithoutFeedback onPress={navigateToDetails}>
                <View style={[{ backgroundColor: colors.button_background, borderRadius: 9 }, CARD_SHADOW]}>
                    <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5 }}>
                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <Text style={{ color: colors.goal_primary_font, fontFamily: POPPINS_SEMI_BOLD, fontSize: 14 }}>{pillar.name}</Text>
                            <Text style={{ color: colors.goal_secondary_font, opacity: 0.9, fontFamily: POPPINS_REGULAR, fontSize: 10 }}>{}</Text>
                        </View>

                        <View style={{ flex: 1, paddingLeft: 10 }}>
                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: POPPINS_REGULAR, fontSize: 10 }}>
                                    age: {daysOld}
                                </Text>
                            </View>

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: POPPINS_REGULAR, fontSize: 10 }}>
                                    times used: {timesUsed}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};
