import React from 'react';
import { CARD_SHADOW } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { ScrollView, TextInput, View } from 'react-native';
import { TaskModel } from 'resources/models';
import TaskController from 'src/controller/planning/TaskController';
import { TaskPreview } from './TaskPreview';

export const Tasks = () => {
    const { colors } = useTheme();
    const [searchText, setSearchText] = React.useState('');
    const [tasks, setTasks] = React.useState<TaskModel[]>([]);

    const onSearchChange = (text: string) => {
        setSearchText(text);
        if (text !== '') {
            fetchTasks(text);
        } else {
            setTasks([]);
        }
    };

    const fetchTasks = async (text: string) => {
        const results = await TaskController.search(text);
        console.log(results);
        setTasks(results);
    };

    const taskElements: JSX.Element[] = [];
    for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        taskElements.push(
            <View style={{ width: '100%', paddingTop: 5, alignItems: 'center' }}>
                <TaskPreview task={task} />
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <View style={{ alignItems: 'center', paddingTop: 20 }}>
                <View
                    style={[
                        {
                            backgroundColor: colors.button_background,
                            paddingTop: 10,
                            paddingBottom: 10,
                            borderRadius: 9,
                            width: '97%',
                            flexDirection: 'row',
                            alignItems: 'center',
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <View
                        style={{
                            alignContent: 'flex-end',
                            alignItems: 'flex-end',
                            justifyContent: 'flex-end',
                            position: 'absolute',
                            zIndex: -1,
                            width: '100%',
                            paddingRight: 15,
                        }}
                    >
                        <Ionicons name={'search'} size={24} color={colors.search_preview} />
                    </View>

                    <TextInput
                        style={{
                            width: '100%',
                            height: '100%',
                            color: colors.user_search_name,
                            fontSize: 16,
                            fontFamily: 'Poppins_400Regular',
                            paddingTop: 2,
                            paddingLeft: 15,
                        }}
                        onChangeText={onSearchChange}
                        value={searchText}
                        placeholderTextColor={colors.search_preview}
                        placeholder={'search for tasks...'}
                        autoCapitalize="none"
                    />
                </View>
            </View>

            <ScrollView style={{ flex: 1 }}>
                <View style={{ paddingTop: 10, width: '100%' }}>{taskElements}</View>
            </ScrollView>
        </View>
    );
};
