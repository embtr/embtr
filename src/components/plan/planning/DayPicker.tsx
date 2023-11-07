import React, { useRef } from 'react';
import { View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { MemoizedDayPickerElement } from './DayPickerElement';
import { getDayKey } from 'src/controller/planning/PlannedDayController';
import { useDispatch } from 'react-redux';
import { setSelectedDayKey } from 'src/redux/user/GlobalState';

const scrollToSelected = (flatListRef: React.RefObject<FlatList>, day: number) => {
    flatListRef.current?.scrollToIndex({
        index: day,
        animated: true,
        viewPosition: 0.5, // Centers the selected item
    });
};

export const DayPicker = () => {
    const itemWidth = Dimensions.get('window').width / 9.5;

    const currentDate = new Date();
    const dateElements = Array.from(
        Array(
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() + 1
        ).keys()
    ).slice(1);

    const flatListRef = useRef<FlatList>(null);
    const [selected, setSelected] = React.useState<number>(0);
    const dispatch = useDispatch();

    const onSelectionChange = (day: number) => {
        setSelected(day);
        scrollToSelected(flatListRef, day);
        const newDayKey = getDayKey(day + 1);
        dispatch(setSelectedDayKey(newDayKey));
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
