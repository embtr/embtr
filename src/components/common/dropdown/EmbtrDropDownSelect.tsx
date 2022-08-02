import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import DropDownPicker from 'react-native-dropdown-picker';

interface Props {
    items: any,
    onItemSelected: Function
}

export const EmbtrDropDownSelect = ({ items, onItemSelected }: Props) => {
    const { colors } = useTheme();
    const [menuOpen, setMenuOption] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');

    const itemSelected = (item: any) => {
        setSelectedValue(item);
        onItemSelected(item);
    };

    const hasGoals = items.length > 0;

    const MAX_DROPDOWN_HEIGHT = 250;
    const calculatedHeight = 50 * (items.length + 1)
    const menuOpenHeight = calculatedHeight < MAX_DROPDOWN_HEIGHT ? calculatedHeight : MAX_DROPDOWN_HEIGHT;

    return (
        <View style={{ height: menuOpen ? menuOpenHeight : undefined, width: "95%", borderBottomRightRadius: menuOpen ? 0 : 12, borderBottomLeftRadius: menuOpen ? 0 : 12, borderTopRightRadius: 12, borderTopLeftRadius: 12 }}>
            <DropDownPicker
                dropDownContainerStyle={{ borderWidth: 1, borderColor: colors.text_input_border, borderTopWidth: 0, backgroundColor: colors.text_input_background }}
                style={{ borderWidth: 1, borderColor: colors.text_input_border, backgroundColor: colors.text_input_background }}
                textStyle={{ fontFamily: "Poppins_400Regular", color: colors.goal_primary_font, fontSize: 15 }}
                listItemContainerStyle={{ borderTopWidth: 1, borderColor: colors.text_input_border, height: 50 }}
                listChildContainerStyle={{height: 60}}
                open={menuOpen}
                placeholder={hasGoals ? "Select A Goal" : "No Goals Found"}
                value={selectedValue}
                items={items}
                setOpen={hasGoals ? setMenuOption : () => { }}
                setValue={itemSelected}

                multiple={false}
            />
        </View>
    );
};