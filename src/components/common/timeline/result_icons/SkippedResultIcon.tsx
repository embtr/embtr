import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const SkippedResultIcon = () => {
    const colors = useTheme().colors;

    return <Ionicons name={'arrow-forward-circle'} size={20} color={colors.progress_bar_skipped} />;
};
