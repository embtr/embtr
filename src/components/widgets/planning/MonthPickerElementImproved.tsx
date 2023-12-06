import { View, Pressable, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { MonthPickerElementData } from 'src/model/PlanningWidget';
import { POPPINS_MEDIUM } from 'src/util/constants';

interface Props {
    elementData: MonthPickerElementData;
    isSelected: boolean;
    onSelect: (monthData: MonthPickerElementData) => void;
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    text: {
        fontSize: 15,
        fontFamily: POPPINS_MEDIUM,
    },
});

export const MonthPickerElementImproved = ({ elementData, isSelected, onSelect }: Props) => {
    const { colors } = useTheme();

    const textColor = isSelected ? colors.accent_color : colors.today_calendar_picker_unselected;

    return (
        <TouchableOpacity
            onPress={() => {
                onSelect(elementData);
            }}
        >
            <View style={styles.container}>
                <Text
                    style={[
                        styles.text,
                        {
                            color: textColor,
                        },
                    ]}
                >
                    {elementData.monthString}
                </Text>
            </View>
        </TouchableOpacity>
    );
};
