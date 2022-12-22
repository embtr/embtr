import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { CARD_SHADOW } from 'src/util/constants';
import { PillarModel } from 'src/model/PillarModel';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    pillar: PillarModel;
}

export const Pillar = ({ pillar }: Props) => {
    const { colors } = useTheme();
    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    return (
        <View style={{ width: '97%' }}>
            <TouchableWithoutFeedback
                onPress={() => {
                    navigation.navigate('PillarDetails', { uid: pillar.uid, id: pillar.id! });
                }}
            >
                <View style={[{ backgroundColor: colors.button_background, borderRadius: 15, paddingTop: 10 }, CARD_SHADOW]}>
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>{pillar.name}</Text>

                        <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_400Regular', opacity: 0.75, fontSize: 10, paddingTop: 3 }}></Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};
