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

const shadow = {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: .5,  
    elevation: 5
}

export const Task = ({ task, backgroundColor }: Props) => {
    const { colors } = useTheme();

    const navigation = useNavigation<StackNavigationProp<PlanTabScreens>>();

    return (
        <TouchableOpacity key={task.id} onPress={() => { navigation.navigate('TaskDetails', { id: task.id! }) }}>
            <View style={[{ height: 80, backgroundColor: backgroundColor || colors.card_background, borderRadius: 7.5, justifyContent: "center"  }, shadow]}>
                <View style={{ height: "auto", paddingTop: 5 }}>
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={{ color: colors.text, fontSize: 16 }}>
                            {task.name}
                        </Text>
                    </View>

                    <View style={{ flex: 1 }} />

                </View>
            </View>
        </TouchableOpacity>
    );
};