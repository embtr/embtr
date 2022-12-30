import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';
import { CARD_SHADOW } from 'src/util/constants';
import { RoutineModel } from 'src/controller/routine/RoutineController';

interface Props {
    routine: RoutineModel;
}

export const Routine = ({ routine }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    const navigateToDetails = () => {};

    return (
        <View style={{ width: '97%' }}>
            <TouchableWithoutFeedback onPress={navigateToDetails}>
                <View style={[{ backgroundColor: colors.button_background, borderRadius: 15, paddingTop: 8, paddingBottom: 10 }, CARD_SHADOW]}>
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_600SemiBold', fontSize: 14 }}>{routine.name}</Text>

                        <Text style={{ color: colors.goal_primary_font, fontFamily: 'Poppins_400Regular', opacity: 0.75, fontSize: 10, paddingTop: 3 }}>
                            {routine.description}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </View>
    );
};
