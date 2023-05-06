import { FlatList, View, Text, TouchableOpacity, ListRenderItemInfo } from 'react-native';
import React from 'react';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { POPPINS_REGULAR } from 'src/util/constants';
import { Habit } from 'resources/schema';
import { HabitIcon } from '../habit/HabitIcon';

/*
 * https://github.com/Shopify/flash-list
 */

interface Props {
    habits: Habit[];
    initialHabit?: Habit;
    onHabitSelected: Function;
}

export const HabitScrollSelector = ({ habits, initialHabit, onHabitSelected }: Props) => {
    const { colors } = useTheme();

    const [selected, setSelected] = React.useState<number | undefined>();

    React.useEffect(() => {
        if (initialHabit) {
            setSelected(initialHabit.id);
        }
    }, [initialHabit]);

    const getText = (habit: Habit, color: string) => {
        if (!habit.title) {
            return <View />;
        }

        const elements: JSX.Element[] = [];
        for (const token of habit.title.split(' ')) {
            elements.push(
                <Text
                    key={token}
                    style={{
                        lineHeight: 10,
                        color,
                        fontSize: 10,
                        fontFamily: POPPINS_REGULAR,
                    }}
                >
                    {token}
                </Text>
            );
        }
        if (elements.length === 1) {
            elements.push(
                <Text
                    key={'space_placeholder'}
                    style={{
                        lineHeight: 10,
                        color,
                        fontSize: 10,
                        fontFamily: POPPINS_REGULAR,
                    }}
                >
                    {' '}
                </Text>
            );
        }
        return elements;
    };
    const createItem = (habit: Habit) => {
        const color = selected === habit.id ? colors.tab_selected : colors.text;

        const Item = (
            <View style={{ paddingLeft: 5, paddingRight: 5, alignItems: 'center', height: 40 }}>
                <View style={{ height: 33 }}>
                    <HabitIcon habit={habit} size={30} color={color} />
                </View>
                <View style={{ alignItems: 'center' }}>{getText(habit, color)}</View>
            </View>
        );

        return Item;
    };

    const onChangeHabit = (habit: Habit) => {
        console.log('onChangeHabit', habit.id, selected);
        if (selected === habit.id) {
            setSelected(undefined);
            onHabitSelected(undefined);
        } else {
            setSelected(habit.id);
            onHabitSelected(habit);
        }
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
