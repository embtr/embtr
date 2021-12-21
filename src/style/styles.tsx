import { TextStyle } from "react-native";
import { useTheme } from "src/components/theme/ThemeProvider";

const { colors } = useTheme();

export const headerTextStyle = {
    fontSize: 30,
    color: colors.text,
} as TextStyle;