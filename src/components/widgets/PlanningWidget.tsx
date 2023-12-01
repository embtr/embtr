import { Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { Planning } from '../plan/planning/Planning';
import React from 'react';
import { TodayPageLayoutContext } from '../today/TodayPageLayoutContext';
import { useAppSelector } from 'src/redux/Hooks';
import { getSelectedDayKey } from 'src/redux/user/GlobalState';
import { getMonthFromDayKey } from 'src/controller/planning/PlannedDayController';

export const PlanningWidget = () => {
    const todayPageLayoutContext = React.useContext(TodayPageLayoutContext);

    const WIDGET_PADDING_HEIGHT = 16;

    const onLayout = (event: any) => {
        const { height } = event.nativeEvent.layout;
        todayPageLayoutContext.setWidgetTitleHeight(height + WIDGET_PADDING_HEIGHT);
    };

    return (
        <WidgetBase>
            <View>
                <View onLayout={onLayout}>
                    <MonthView />
                </View>
                <Planning />
            </View>
        </WidgetBase>
    );
};

export const MonthView = () => {
    const { colors } = useTheme();

    const selectedDayKey = useAppSelector(getSelectedDayKey);
    const month = getMonthFromDayKey(selectedDayKey);

    return (
        <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
            Planning for <Text style={{ color: colors.accent_color }}>{month}</Text>
        </Text>
    );
};
