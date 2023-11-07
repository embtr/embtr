import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { Planning } from '../plan/planning/Planning';

export const PlanningWidget = () => {
    const { colors } = useTheme();

    return (
        <WidgetBase>
            <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    Planning
                </Text>

                <Planning />
            </View>
        </WidgetBase>
    );
};
