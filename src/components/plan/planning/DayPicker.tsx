import React, { useRef } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { DayPickerElement } from './DayPickerElement';

interface Props {
    day: number;
    onDayChanged: Function;
}

export const DayPicker = ({ day, onDayChanged }: Props) => {
    const currentDate = new Date();
    const dateElements = Array.from(
        Array(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() + 1
        ).keys()
    ).slice(1);

    const flatListRef = useRef<FlatList>(null);
    const [selected, setSelected] = React.useState<number>(day - 1);

    const onSelectionChange = (day: number) => {
        setSelected(day);
        onDayChanged(day + 1);
        scrollToSelected(day);
    };

    const scrollToSelected = (day: number) => {
        flatListRef.current?.scrollToIndex({
            index: day,
            animated: true,
            viewPosition: 0.5, // Centers the selected item
        });
    };

    const renderItem = ({ item, index }: { item: number; index: number }) => (
        <TouchableOpacity onPress={() => onSelectionChange(index)}>
            <DayPickerElement item={item} index={index} isSelected={index === selected} />
        </TouchableOpacity>
    );

    return (
        <View>
            <FlatList
                ref={flatListRef}
                data={dateElements}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.toString()}
                renderItem={renderItem}
                initialScrollIndex={selected - 4}
            />
        </View>
    );
};
