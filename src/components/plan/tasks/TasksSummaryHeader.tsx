import React from 'react';
import { View, Text } from 'react-native';
import { HorizontalLine } from 'src/components/common/HorizontalLine';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TaskModel } from 'src/controller/planning/TaskController';

interface Props {
    tasks: TaskModel[]
}

export const TasksSummaryHeader = ({ tasks }: Props) => {
    const { colors } = useTheme();

    return (
        <View>
            <View style={{ height: "auto", paddingTop: 5, paddingBottom: 5 }}>
                <View style={{ padding: 5 }}>
                    <View style={{ flexDirection: "row", padding: 5 }}>
                        <Text style={{ flex: 1, color: colors.text, textAlign: "center" }}>
                            Total Tasks: {tasks.length}
                        </Text>
                    </View>
                </View>
            </View>

            <HorizontalLine />
        </View>
    );
};