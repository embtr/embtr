import { TouchableOpacity, View, Text } from 'react-native';
import Toast from 'react-native-root-toast';
import { PlannedDay, Task, Unit } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';
import PlannedTaskController from 'src/controller/planning/PlannedTaskController';
import TaskController from 'src/controller/planning/TaskController';
import { POPPINS_MEDIUM } from 'src/util/constants';

interface Props {
    task: Task;
    plannedDay: PlannedDay;
    unit?: Unit;
    quantity?: number;
    setPlannedTaskFromDatabase: Function;
    onPressed?: Function;
}

export const AddTaskButton = ({
    task,
    plannedDay,
    unit,
    quantity,
    setPlannedTaskFromDatabase,
    onPressed,
}: Props) => {
    const { colors } = useTheme();
    return (
        <TouchableOpacity
            style={{
                width: '100%',
                height: '100%',
            }}
            onPress={async () => {
                if (onPressed) {
                    onPressed();
                }

                Toast.show('task added!', {
                    duration: Toast.durations.LONG,
                });

                let taskToAdd = task;

                if (!task.id) {
                    taskToAdd = await TaskController.createViaApi(task.title!);
                }

                const created = await PlannedTaskController.create(
                    plannedDay,
                    taskToAdd,
                    unit,
                    quantity
                );
                setPlannedTaskFromDatabase(created.plannedTask);
                TaskController.updatePreference(task, unit, quantity);
            }}
        >
            <View
                style={{
                    borderRadius: 7,
                    backgroundColor: '#27B24A',
                    alignItems: 'center',
                    paddingVertical: 4,
                    marginVertical: 1,
                }}
            >
                <Text
                    style={{
                        color: colors.text,
                        fontFamily: POPPINS_MEDIUM,
                        includeFontPadding: false,
                    }}
                >
                    Add
                </Text>
            </View>
        </TouchableOpacity>
    );
};
