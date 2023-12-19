import { View, Text } from 'react-native';
import { CompletedHabit } from 'resources/types/planned_day_result/PlannedDayResult';
import { OptimalImageData } from 'src/components/common/images/OptimalImage';
import { HabitIcon } from 'src/components/plan/habit/HabitIcon';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { ScheduledHabitCustomHooks } from 'src/controller/habit/ScheduledHabitController';
import { UnitUtility } from 'src/util/UnitUtility';
import { POPPINS_MEDIUM, POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    completedHabit: CompletedHabit;
    color?: string;
}

export const CompletedHabitElement = ({ completedHabit, color }: Props) => {
    const { colors } = useTheme();
    const scheduledHabit = ScheduledHabitCustomHooks.useScheduledHabit(completedHabit.scheduledHabitId);

    if (!scheduledHabit.data) {
        return <View />;
    }

    const task = scheduledHabit.data.task;
    const optimalImageData: OptimalImageData = {
        localImage: task?.localImage,
        remoteImageUrl: task?.remoteImageUrl, 
    }

    const textElements: JSX.Element[] = [];
    for (let i = 0; i < completedHabit.elements.length; i++) {
        const element = completedHabit.elements[i];
        const isComplete = element.completedQuantity >= element.quantity;
        textElements.push(
            <Text
                key={i}
                style={{
                    fontFamily: POPPINS_SEMI_BOLD,
                    fontSize: 14,
                    includeFontPadding: false,
                    color: isComplete ? colors.progress_bar_complete : colors.tab_selected,
                    lineHeight: 16,
                }}
            >
                {element.completedQuantity}

                <Text
                    key={i}
                    style={{
                        fontFamily: POPPINS_MEDIUM,
                        fontSize: 10,
                        includeFontPadding: false,
                        color: colors.secondary_text,
                    }}
                >
                    {' '}
                    {element.unit
                        ? UnitUtility.getReadableUnit(element.unit, element.completedQuantity)
                        : 'x'}
                </Text>
            </Text>
        );

        if (i === 1) {
            break;
        }
    }

    return (
        <View style={{ alignItems: 'center', flexDirection: 'row' }}>
            <HabitIcon
                optimalImageData={optimalImageData}
                size={30}
                color={color ?? colors.tab_selected}
            />

            <View style={{ paddingLeft: 6 }}>
                <Text
                    style={{
                        fontFamily: POPPINS_MEDIUM,
                        fontSize: 11,
                        color: colors.text,
                    }}
                >
                    {task?.title}
                </Text>

                <View style={{}}>{textElements}</View>
            </View>
        </View>
    );
};
