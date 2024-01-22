import { WidgetBase } from '../WidgetBase';
import { View, Text } from 'react-native';
import { POPPINS_SEMI_BOLD, PADDING_LARGE } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import React from 'react';
import { PlanToday } from 'src/components/plan/planning/PlanToday';
import { Checkbox } from 'src/components/checkbox/Checkbox';

export const TodaysTasksWidgetImproved = () => {
    const colors = useTheme().colors;
    const [hideComplete, setHideComplete] = React.useState<boolean>(false);

    return (
        <WidgetBase>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    Today's Tasks
                </Text>
                <View style={{ flex: 1 }} />

                <Checkbox
                    text={'Hide Complete '}
                    checked={hideComplete}
                    onCheck={() => {
                        setHideComplete(!hideComplete);
                    }}
                />
            </View>

            <View style={{ paddingTop: PADDING_LARGE }} />

            <PlanToday hideComplete={hideComplete} />
        </WidgetBase>
    );
};
