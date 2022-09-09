import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { CARD_SHADOW } from 'src/util/constants';
import { GoalModel } from 'src/controller/planning/GoalController';
import { differenceInDays } from 'date-fns';
import { PillarModel } from 'src/model/PillarModel';

interface Props {
    goal: GoalModel,
    pillars: PillarModel[]
}

export const Goal = ({ goal, pillars }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const navigateToDetails = () => {
        navigation.navigate('GoalDetails', { id: goal.id! })
    };

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold, Poppins_400Regular
    });

    if (!fontsLoaded) {
        return <View />
    }

    let pillarName = "unknown 😅";
    pillars.forEach(pillar => {
        if (pillar.id === goal.pillarId) {
            pillarName = pillar.name;
            return;
        }
    });

    const totalDays = differenceInDays(goal.deadline.toDate(), goal.added.toDate());
    const daysRemaining = differenceInDays(goal.deadline.toDate(), new Date());
    const daysPassed = totalDays - daysRemaining;
    const daysRemainingPercent = Math.min(100, Math.floor((daysPassed / totalDays) * 100));
    const daysRemainingString = daysRemaining > 0
        ? "ends in " + daysRemaining + " days"
        : "ended " + Math.abs(daysRemaining) + " days ago";

    return (
        <View style={{ width: "97%" }}>
            <TouchableOpacity onPress={navigateToDetails} >
                <View style={[{ backgroundColor: colors.button_background, borderRadius: 15, paddingTop: 10 }, CARD_SHADOW]}>
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={{ color: colors.goal_primary_font, fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
                            {goal.name}
                        </Text>

                        <Text style={{ color: colors.goal_primary_font, fontFamily: "Poppins_400Regular", opacity: .75, fontSize: 10, paddingTop: 3 }}>
                            {goal.description}
                        </Text>
                    </View>

                    <View style={{ paddingTop: 8, marginLeft: 10, marginRight: 10 }}>
                        <HorizontalLine />
                    </View>

                    <View style={{ paddingLeft: 10 }}>
                        <View style={{ width: "100%", alignContent: "center", paddingTop: 5 }}>
                            <ProgressBar progress={daysRemainingPercent} />
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}>
                        <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10, alignItems: "center" }}>
                            <Ionicons name={'time-outline'} size={16} color={colors.goal_secondary_font} />
                            <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>{daysRemainingString}</Text>
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
