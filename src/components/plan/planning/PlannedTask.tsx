import { View, Text, ColorValue } from 'react-native';
import { PlannedTaskModel } from 'resources/models/PlannedTaskModel';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    plannedTask: PlannedTaskModel;
    backgroundColor?: ColorValue;
}

export const PlannedTask = ({ plannedTask, backgroundColor }: Props) => {
    const { colors } = useTheme();

    return (
        <View style={{ backgroundColor: backgroundColor || colors.card_background_active }}>
            <View style={{ height: 'auto', paddingTop: 5, paddingBottom: 5 }}>
                <View style={{ padding: 5 }}>
                    <Text style={{ color: colors.text, textAlign: 'center' }}>{plannedTask.task!.title}</Text>
                </View>
            </View>
        </View>
    );
};
