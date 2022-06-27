import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, ColorValue, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { ProgressBar } from 'src/components/plan/goals/ProgressBar';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { CARD_SHADOW } from 'src/util/constants';

export const Goal = () => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold, Poppins_400Regular
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View style={{ width: "95%" }}>
            <TouchableOpacity >
                <View style={[{ backgroundColor: colors.button_background, borderRadius: 15, paddingTop: 10 }, CARD_SHADOW]}>
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={{ color: colors.goal_primary_font, fontFamily: "Poppins_600SemiBold", fontSize: 14 }}>
                            Mow The Lawn
                        </Text>

                        <Text style={{ color: colors.goal_primary_font, fontFamily: "Poppins_400Regular", opacity: .75, fontSize: 10, paddingTop: 3 }}>
                            here is a super helpful and impactful description
                        </Text>
                    </View>

                    <View style={{ paddingTop: 8, marginLeft: 10, marginRight: 10 }}>
                        <HorizontalLine />
                    </View>

                    <View style={{ paddingLeft: 10 }}>
                        <View style={{ width: "100%", alignContent: "center", paddingTop: 5 }}>
                            <ProgressBar progress={25} />
                        </View>
                    </View>

                    <View style={{ flexDirection: "row", paddingTop: 10, paddingBottom: 10 }}>
                        <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10, alignItems: "center" }}>
                            <Ionicons name={'time-outline'} size={16} color={colors.goal_secondary_font} />
                            <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>23 Days Out</Text>
                        </View>

                        <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", paddingRight: 30 }}>
                            <MaterialCommunityIcons name="pillar" size={14} color={colors.goal_secondary_font} />
                            <Text style={{ paddingLeft: 5, color: colors.goal_secondary_font, fontFamily: "Poppins_400Regular", fontSize: 12 }}>Fitness</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
};