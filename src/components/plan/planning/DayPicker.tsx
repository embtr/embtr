import React, { useRef } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { MemoizedDayPickerElement } from './DayPickerElement';

interface Props {
    day: number;
    onDayChanged: Function;
}
const scrollToSelected = (flatListRef: React.RefObject<FlatList>, day: number) => {
    flatListRef.current?.scrollToIndex({
        index: day,
        animated: true,
        viewPosition: 0.5, // Centers the selected item
    });
};

export const DayPicker = ({ day, onDayChanged }: Props) => {
    const itemWidth = Dimensions.get('window').width / 9.5;

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
        scrollToSelected(flatListRef, day);
    };

    const renderItem = ({ item, index }: { item: number; index: number }) => {
        return (
            <MemoizedDayPickerElement
                item={item}
                index={index}
                isSelected={index === selected}
                itemWidth={itemWidth}
                onSelectionChange={onSelectionChange}
            />
        );
    };

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
                getItemLayout={(data, index) => ({
                    length: itemWidth,
                    offset: itemWidth * index,
                    index,
                })}
            />
        </View>
    );
};
