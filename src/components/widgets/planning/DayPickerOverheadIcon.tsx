import { Ionicons } from '@expo/vector-icons';
import { CompleteResultIcon } from 'src/components/common/timeline/result_icons/CompleteResultIcon';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';

interface Props {
    dayKey: string;
    isToday: boolean;
    isSelected: boolean;
}

export const DayPickerOverheadIcon = ({ dayKey, isToday, isSelected }: Props) => {
    const colors = useTheme().colors;

    const isComplete = PlannedDayCustomHooks.usePlannedDayIsComplete(dayKey);

    const textColor = isSelected
        ? colors.accent_color_light
        : colors.today_calendar_picker_unselected;

    const iconAbove = isToday ? (
        <Ionicons name={'sunny-outline'} size={12} color={textColor} />
    ) : isComplete === true ? (
        <CompleteResultIcon size={12} />
    ) : null;

    return iconAbove;
};
