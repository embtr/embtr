import { WidgetBase } from '../WidgetBase';
import { View, Text } from 'react-native';
import {
    CARD_SHADOW,
    POPPINS_REGULAR,
    POPPINS_SEMI_BOLD,
    TIMELINE_CARD_PADDING,
} from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { PlanToday } from 'src/components/plan/planning/PlanToday';

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

                <Text
                    style={{
                        color: colors.secondary_text,
                        fontFamily: POPPINS_REGULAR,
                        fontSize: 12,
                    }}
                >
                    hide complete
                </Text>
                <View style={{ width: TIMELINE_CARD_PADDING / 2 }} />

                <TouchableOpacity
                    onPress={() => {
                        setHideComplete(!hideComplete);
                    }}
                    style={[
                        {
                            backgroundColor: '#404040',
                            borderRadius: 5,
                            paddingHorizontal: 4,
                            paddingVertical: 2,
                        },
                        CARD_SHADOW,
                    ]}
                >
                    <Ionicons
                        name={'checkmark-done-sharp'}
                        size={20}
                        color={hideComplete ? colors.accent_color : colors.secondary_text}
                    />
                </TouchableOpacity>
            </View>

            <View style={{ paddingTop: TIMELINE_CARD_PADDING }} />

            <PlanToday hideComplete={hideComplete} />
        </WidgetBase>
    );
};
