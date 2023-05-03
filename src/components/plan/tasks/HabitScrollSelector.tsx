import { FlatList, View, Text, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { IoniconName, POPPINS_REGULAR } from 'src/util/constants';
import { Habit } from 'resources/schema';

/*
 * https://github.com/Shopify/flash-list
 */

interface Props {
    habits: Habit[];
    onHabitSelected: Function;
}

export const HabitScrollSelector = ({ habits, onHabitSelected }: Props) => {
    const { colors } = useTheme();

    const [selected, setSelected] = React.useState<number>();

    const createItem = (habit: Habit) => {
        const color = selected === habit.id ? colors.tab_selected : colors.text;

        const Item = (
            <View style={{ paddingLeft: 5, paddingRight: 5, alignItems: 'center' }}>
                <Text style={{ color, fontSize: 10, fontFamily: POPPINS_REGULAR }}>
                    {habit.title}
                </Text>
                <Ionicons name={habit.iconName as IoniconName} size={30} color={color} />
            </View>
        );

        return Item;
    };

    const onChangeHabit = (habit: Habit) => {
        setSelected(habit.id);
        onHabitSelected(habit);
    };

    const renderItem = ({ item }: ListRenderItemInfo<Habit>) => {
        return (
            <TouchableOpacity onPress={() => onChangeHabit(item)}>
                {createItem(item)}
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={habits}
                renderItem={renderItem}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id!.toString()}
            />
        </View>
    );
};
