import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RoutineModel } from 'src/controller/planning/TaskController';
import { Plan } from 'src/components/plan/Plan';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    routine: RoutineModel
}

export const Task = ({ routine }: Props) => {

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    return (
        <TouchableOpacity key={routine.id} onPress={() => { navigation.navigate('TaskDetails', { id: routine.id! }) }}>
            <View style={{ paddingBottom: 5 }}>
                <Plan routine={routine} />
            </View>
        </TouchableOpacity>
    );
};