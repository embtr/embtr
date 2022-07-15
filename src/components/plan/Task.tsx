import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, ColorValue, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TaskModel } from 'src/controller/planning/TaskController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { CARD_SHADOW } from 'src/util/constants';
import GoalController, { GoalModel } from 'src/controller/planning/GoalController';
import { getAuth } from 'firebase/auth';
import { PillarModel } from 'src/model/PillarModel';

interface Props {
    task: TaskModel,
    pillars: PillarModel[]
}

export const Task = ({ task, pillars }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const navigateToDetails = () => {
        navigation.navigate('TaskDetails', { id: task.id! })
    };

    const [goal, setGoal] = React.useState<GoalModel | undefined>(undefined);

    let pillarName = "unknown ???";
    pillars.forEach(pillar => {
        if (goal?.pillarId === pillar.id) {
            pillarName = pillar.name;
            return;
        }
    });

    React.useEffect(() => {
        const uid = getAuth().currentUser?.uid;

        if (task.goalId && uid) {
            GoalController.getGoal(uid, task.goalId, setGoal);
        }
    }, []);

    return (
        <View style={{ width: "97%" }}>
            <TouchableOpacity onPress={navigateToDetails} >
                <View style={[{ backgroundColor: colors.button_background, borderRadius: 15, paddingTop: 10 }, CARD_SHADOW]}>
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={{ color: colors.goal_primary_font, fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
                            {task.name}
                        </Text>

                        <Text style={{ color: colors.goal_primary_font, fontFamily: "Poppins_400Regular", opacity: .75, fontSize: 10, paddingTop: 3 }}>{task.description}</Text>
                    </View>

                    <View style={{ paddingTop: 8, marginLeft: 10, marginRight: 10 }}>
                        <HorizontalLine />
                    </View>

                    <View style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}>

                        <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10, alignItems: "center" }}>
                            <Ionicons name={'stats-chart-outline'} size={14} color={colors.goal_secondary_font} />
                            <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>{goal?.name}</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingRight: 30 }}>
                            <MaterialCommunityIcons name="pillar" size={14} color={colors.goal_secondary_font} />
                            <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>{pillarName}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};