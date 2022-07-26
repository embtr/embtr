import * as React from 'react';
import { View, Text, TextStyle, ViewStyle, Alert } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PillarModel } from 'src/model/PillarModel';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useFonts, Poppins_600SemiBold, Poppins_400Regular } from '@expo-google-fonts/poppins';
import { format } from 'date-fns';


interface Props {
    pillarModel: PillarModel,
    enableDelete?: boolean,
    deleteOnPress?: Function
};

export const Pillar = ({ pillarModel, enableDelete, deleteOnPress }: Props) => {
    const { colors } = useTheme();

    let [fontsLoaded] = useFonts({
        Poppins_600SemiBold, Poppins_400Regular
    });

    if (!fontsLoaded) {
        return <View />
    }

    return (
        <View style={[{ flexDirection: "row" }]}>
            <View style={{ flex: 1 }}>
                <View style={{ paddingLeft: 15, paddingTop: 15 }}>
                    <Text style={{ fontFamily: "Poppins_600SemiBold", fontSize: 14, color: colors.profile_pillar_title }}>{pillarModel.name}</Text>
                </View>

                <View style={{ flexDirection: "row", width: "100%", paddingTop: 10 }}>
                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name={'calendar-outline'} size={20} color={colors.profile_pillar_attribute_icon} />
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={{ fontSize: 10, fontFamily: "Poppins_400Regular", color: colors.profile_pillar_attribute_name, opacity: .8 }}>Created</Text>
                            <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: colors.profile_pillar_attribute_value }}>{format(pillarModel.added.toDate(), 'MMMM dd, yyyy')}</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <FontAwesome name="tasks" size={20} color={colors.profile_pillar_attribute_icon} />
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={{ fontSize: 10, fontFamily: "Poppins_400Regular", color: colors.profile_pillar_attribute_name, opacity: .8 }}>Tasks Completed</Text>
                            <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: colors.profile_pillar_attribute_value }}>184</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
                        <Ionicons name={'trophy-outline'} size={20} color={colors.profile_pillar_attribute_icon} />
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={{ fontSize: 10, fontFamily: "Poppins_400Regular", color: colors.profile_pillar_attribute_name, opacity: .8 }}>Longest Streak</Text>
                            <Text style={{ fontSize: 11, fontFamily: "Poppins_400Regular", color: colors.profile_pillar_attribute_value }}>8</Text>
                        </View>
                    </View>
                    {enableDelete && <View style={{ marginRight: 10 }}><Ionicons name={"trash-bin-outline"} size={18} color={colors.text} onPress={() => { deleteOnPress && deleteOnPress() }} /></View>}
                </View>

                <View style={{ width: "100%", paddingTop: 15, alignItems: "center" }}>
                    <View style={{ width: "90%", height: 1, backgroundColor: colors.profile_pillar_separator, opacity: .15 }} />
                </View>

            </View>
        </View>
    );
};