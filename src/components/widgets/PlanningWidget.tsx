import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { Planning } from '../plan/planning/Planning';
import React from 'react';
import { TodayPageLayoutContext } from '../today/TodayPageLayoutContext';

export const PlanningWidget = () => {
    const { colors } = useTheme();
    const todayPageLayoutContext = React.useContext(TodayPageLayoutContext);

    const WIDGET_PADDING_HEIGHT = 16;

    const onLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        todayPageLayoutContext.setWidgetTitleHeight(height + WIDGET_PADDING_HEIGHT);
    };

    return (
        <WidgetBase>
            <View>
                <Text
                    onLayout={onLayout}
                    style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}
                >
                    Planning
                </Text>

                <Planning />
            </View>
        </WidgetBase>
    );
};
