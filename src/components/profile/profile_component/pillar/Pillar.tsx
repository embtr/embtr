import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PillarModel } from 'src/model/PillarModel';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { format } from 'date-fns';

interface Props {
    pillarModel: PillarModel;
    enableDelete?: boolean;
    deleteOnPress?: Function;
}

export const Pillar = ({ pillarModel, enableDelete, deleteOnPress }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={[{ flexDirection: 'row' }]}>
            <View style={{ flex: 1 }}>
                <View style={{ paddingLeft: 10 }}>
                    <Text style={{ fontFamily: 'Poppins_600SemiBold', fontSize: 13, color: colors.profile_pillar_title }}>{pillarModel.name}</Text>
                </View>

                <View style={{ flexDirection: 'row', width: '100%', paddingTop: 2 }}>
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', paddingLeft: 10 }}>
                        <Ionicons name={'calendar-outline'} size={20} color={colors.profile_pillar_attribute_icon} />
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={{ fontSize: 10, fontFamily: 'Poppins_400Regular', color: colors.profile_pillar_attribute_name, opacity: 0.8 }}>
                                Created
                            </Text>
                            <Text style={{ fontSize: 11, fontFamily: 'Poppins_400Regular', color: colors.tab_selected }}>
                                {format(pillarModel.added.toDate(), 'MMMM dd, yyyy')}
                            </Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name="tasks" size={20} color={colors.profile_pillar_attribute_icon} />
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={{ fontSize: 10, fontFamily: 'Poppins_400Regular', color: colors.profile_pillar_attribute_name, opacity: 0.8 }}>
                                Tasks Completed
                            </Text>
                            <Text style={{ fontSize: 11, fontFamily: 'Poppins_400Regular', color: '#c809eb' }}>184</Text>
                        </View>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        <Ionicons name={'trophy-outline'} size={20} color={colors.profile_pillar_attribute_icon} />
                        <View style={{ paddingLeft: 5 }}>
                            <Text style={{ fontSize: 10, fontFamily: 'Poppins_400Regular', color: colors.profile_pillar_attribute_name, opacity: 0.8 }}>
                                Longest Streak
                            </Text>
                            <Text style={{ fontSize: 11, fontFamily: 'Poppins_400Regular', color: colors.progress_bar_complete }}>8</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};
