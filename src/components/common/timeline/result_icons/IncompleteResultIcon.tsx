import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';

export const IncompleteResultIcon = () => {
    const colors = useTheme().colors;

    return <Ionicons name={'checkmark-circle'} size={20} color={colors.secondary_text} />;
};
