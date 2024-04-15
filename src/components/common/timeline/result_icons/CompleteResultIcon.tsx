import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    size?: number;
}

export const CompleteResultIcon = ({ size }: Props) => {
    const colors = useTheme().colors;

    return (
        <Ionicons
            name={'checkmark-circle'}
            size={size ?? 20}
            color={colors.progress_bar_complete}
        />
    );
};
