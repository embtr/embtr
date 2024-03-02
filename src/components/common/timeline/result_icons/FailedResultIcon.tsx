import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const FailedResultIcon = () => {
    const colors = useTheme().colors;

    return <Ionicons name={'close-circle'} size={20} color={colors.progress_bar_failed} />;
};
