import * as React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_SEMI_BOLD, PADDING_LARGE, PADDING_SMALL } from 'src/util/constants';
import { HabitIcon } from 'src/components/plan/habit/HabitIcon';
import { OptimalImageData } from '../images/OptimalImage';
import { PlannedTask } from 'resources/schema';
import { DailyResultCardElementTimeOfDay } from './DailyResultCardElementTimeOfDay';

interface Props {
    plannedTasks: PlannedTask[];
    onPress?: Function;
}

export const DailyResultCardElement = ({ plannedTasks, onPress }: Props) => {
    const { colors } = useTheme();

    const plannedTask = plannedTasks?.[0] ?? undefined;
    if (!plannedTask) {
        return <View />;
    }

    const optimalImageData: OptimalImageData = {
        remoteImageUrl: plannedTask.remoteImageUrl,
    };

    const views: JSX.Element[] = [];
    plannedTasks.forEach((plannedTask, index) => {
        views.push(
            <View key={plannedTask.id} style={{ paddingRight: PADDING_SMALL }}>
                <DailyResultCardElementTimeOfDay plannedTask={plannedTask} />
            </View>
        );
    });

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {plannedTask.remoteImageUrl && (
                <HabitIcon
                    optimalImageData={optimalImageData}
                    size={35}
                    color={colors.tab_selected}
                />
            )}
            <View style={{ paddingLeft: PADDING_LARGE / 2 }}>
                <View style={{ flexDirection: 'row' }}>
                    <Text
                        style={{
                            color: colors.goal_primary_font,
                            fontFamily: POPPINS_SEMI_BOLD,
                            fontSize: 12,
                            includeFontPadding: false,
                        }}
                    >
                        {plannedTask?.title}{' '}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        paddingTop: PADDING_SMALL / 2,
                    }}
                >
                    {views}
                </View>
            </View>
        </View>
    );
};
