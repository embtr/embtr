import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, ColorValue, TouchableOpacity } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TaskModel } from 'src/controller/planning/TaskController';
import { PlanTabScreens } from 'src/navigation/RootStackParamList';

interface Props {
    task: TaskModel,
    backgroundColor?: ColorValue
}

export const Task = ({ task, backgroundColor }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    return (
        <TouchableOpacity key={task.id} onPress={() => { navigation.navigate('TaskDetails', { id: task.id! }) }}>
            <View style={{ backgroundColor: backgroundColor || colors.card_background }}>
                <View style={{ height: "auto", paddingTop: 5, paddingBottom: 5 }}>
                    <View style={{ padding: 5 }}>
                        <Text style={{ color: colors.text, textAlign: "center", fontSize: 16, fontWeight: "bold" }}>
                            {task.name}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }} />

                </View>
            </View>
        </TouchableOpacity>
    );
};