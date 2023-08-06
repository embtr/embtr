import { View, Text } from 'react-native';
import { CompletedHabit } from 'resources/types/planned_day_result/PlannedDayResult';
import { HabitIcon } from 'src/components/plan/habit/HabitIcon';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { UnitController } from 'src/controller/unit/UnitController';
import { UnitUtility } from 'src/util/UnitUtility';
import { POPPINS_MEDIUM, POPPINS_SEMI_BOLD } from 'src/util/constants';

interface Props {
    completedHabit: CompletedHabit;
    color?: string;
}

export const CompletedHabitElement = ({ completedHabit, color }: Props) => {
    const { colors } = useTheme();

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
                habit={completedHabit.habit}
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
                    {completedHabit.habit.title}
                </Text>

                <View style={{}}>{textElements}</View>
            </View>
        </View>
    );
};
