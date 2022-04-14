import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { TaskModel } from 'src/controller/planning/TaskController';
import { Plan } from 'src/components/plan/Plan';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    task: TaskModel
}

export const Task = ({ task }: Props) => {

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    return (
        <TouchableOpacity key={task.id} onPress={() => { navigation.navigate('TaskDetails', { id: task.id! }) }}>
            <View style={{ paddingBottom: 5 }}>
                <Plan task={task} />
            </View>
        </TouchableOpacity>
    );
};