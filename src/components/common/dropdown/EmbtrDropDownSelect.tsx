import React from 'react';
import { View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import DropDownPicker from 'react-native-dropdown-picker';

interface Props {
    items: any;
    onItemSelected: Function;
    name: string;
}

export const EmbtrDropDownSelect = ({ items, onItemSelected, name }: Props) => {
    const { colors } = useTheme();
    const [menuOpen, setMenuOption] = React.useState(false);
    const [selectedValue, setSelectedValue] = React.useState('');

    const itemSelected = (item: any) => {
        console.log(item);
        setSelectedValue(item);
        onItemSelected(item);
    };

    const hasItems = items.length > 0;

    const MAX_DROPDOWN_HEIGHT = 250;
    const calculatedHeight = 50 * (items.length + 1);
    const menuOpenHeight = calculatedHeight < MAX_DROPDOWN_HEIGHT ? calculatedHeight : MAX_DROPDOWN_HEIGHT;

    return (
        <View
            style={{
                height: menuOpen ? menuOpenHeight : undefined,
                width: '95%',
                borderBottomRightRadius: menuOpen ? 0 : 12,
                borderBottomLeftRadius: menuOpen ? 0 : 12,
                borderTopRightRadius: 12,
                borderTopLeftRadius: 12,
            }}
        >
            <DropDownPicker
                dropDownContainerStyle={{
                    borderWidth: 1,
                    borderColor: colors.text_input_border,
                    borderTopWidth: 0,
                    backgroundColor: colors.text_input_background,
                }}
                style={{ borderWidth: 1, borderColor: colors.text_input_border, backgroundColor: colors.text_input_background }}
                textStyle={{ fontFamily: 'Poppins_400Regular', color: colors.goal_primary_font, fontSize: 15 }}
                listItemContainerStyle={{ borderTopWidth: 1, borderColor: colors.text_input_border, height: 50 }}
                listChildContainerStyle={{ height: 60 }}
                open={menuOpen}
                placeholder={hasItems ? 'Select A ' + name : 'No ' + name + 's Found'}
                value={selectedValue}
                items={items}
                setOpen={hasItems ? setMenuOption : () => {}}
                onSelectItem={itemSelected}
                setValue={setSelectedValue}
                multiple={false}
            />
        </View>
    );
};
