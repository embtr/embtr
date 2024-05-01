import * as React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_SEMI_BOLD, PADDING_LARGE, PADDING_SMALL } from 'src/util/constants';
import { HabitIcon } from 'src/components/plan/habit/HabitIcon';
import { PlannedTask } from 'resources/schema';
import { PlannedTaskUtil } from 'src/util/PlannedTaskUtil';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { PlannedDayResultCardElementTimeOfDay } from './PlannedDayResultCardElementTimeOfDay';

interface Props {
    plannedTasks: PlannedTask[];
}

export const PlannedDayResultCardElement = ({ plannedTasks }: Props) => {
    const { colors } = useTheme();

    const plannedTask = plannedTasks?.[0] ?? undefined;
    if (!plannedTask) {
        return <View />;
    }

    const optimalImageData: OptimalImageData = PlannedTaskUtil.getOptimalImage(plannedTask);

    const views: JSX.Element[] = [];
    plannedTasks.forEach((plannedTask) => {
        views.push(
            <View key={plannedTask.id} style={{ paddingRight: PADDING_SMALL }}>
                <PlannedDayResultCardElementTimeOfDay plannedTask={plannedTask} />
            </View>
        );
    });

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {plannedTask.remoteImageUrl && (
                <View
                    style={{
                        backgroundColor: '#404040',
                        padding: 4,
                        borderRadius: 9,
                        borderWidth: plannedTask.scheduledHabit?.task?.type === 'CHALLENGE' ? 1 : 0,
                        borderColor:
                            plannedTask.scheduledHabit?.task?.type === 'CHALLENGE'
                                ? colors.secondary_accent_color
                                : undefined,
                    }}
                >
                    <HabitIcon
                        optimalImageData={optimalImageData}
                        size={30}
                        color={colors.tab_selected}
                        isChallenge={plannedTask.scheduledHabit?.task?.type === 'CHALLENGE'}
                    />
                </View>
            )}

            <View style={{ flexDirection: 'row', flex: 1, paddingLeft: PADDING_LARGE / 2 }}>
                <View style={{ flex: 1 }}>
                    {/* TITLE */}
                    <Text
                        style={{
                            color: colors.goal_primary_font,
                            fontFamily: POPPINS_SEMI_BOLD,
                            fontSize: 13,
                            top: -2,
                        }}
                    >
                        {plannedTask?.title}
                    </Text>

                    {/* COMPLETION */}
                    <View
                        style={{
                            flexDirection: 'row',
                            paddingBottom: PADDING_SMALL / 4,
                        }}
                    >
                        {views}
                    </View>
                </View>
            </View>
        </View>
    );
};
