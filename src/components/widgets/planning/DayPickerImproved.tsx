import { FlatList } from 'react-native';
import { View } from 'react-native';
import {
    DAY_PICKER_ELEMENT_WIDTH,
    MemoizedDayPickerElementImproved,
} from './DayPickerElementImproved';
import { DayPickerElementData, MonthPickerElementData } from 'src/model/PlanningWidget';
import React from 'react';
//import { FlashList } from '@shopify/flash-list';

interface Props {
    selectedDay: DayPickerElementData;
    selectedMonth: MonthPickerElementData;
    onSelectionChange: Function;
    daysOfTheMonth: Map<string, DayPickerElementData[]>;
}

const render = ({
    item,
    selectedDay,
    selectedMonth,
    onSelectionChange,
}: {
    item: DayPickerElementData;
    selectedDay: DayPickerElementData;
    selectedMonth: MonthPickerElementData;
    onSelectionChange: Function;
}) => (
    <MemoizedDayPickerElementImproved
        elementData={item}
        isSelected={selectedDay.index === item.index}
        monthIndex={selectedMonth.index}
        onSelect={(day: DayPickerElementData) => {
            onSelectionChange(day);
        }}
    />
);

const scrollToSelected = (flatListRef: React.RefObject<FlatList>, index: number) => {
    flatListRef.current?.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.5, // Centers the selected item
    });
};

export const DayPickerImproved = ({
    selectedDay,
    selectedMonth,
    onSelectionChange,
    daysOfTheMonth,
}: Props) => {
    const flatListRef = React.useRef<FlatList>(null);
    const onSelectionChangeWrapper = (day: DayPickerElementData) => {
        scrollToSelected(flatListRef, day.index);
        onSelectionChange(day);
    };

    const zeroPaddedMonth = selectedMonth.month.toString().padStart(2, '0');
    const key = `${selectedMonth.year}${zeroPaddedMonth}`;
    const days = daysOfTheMonth.get(key);

    return (
        <View>
            {/* <FlashList */}
            <FlatList
                ref={flatListRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={days}
                renderItem={(item) =>
                    render({
                        item: item.item,
                        selectedDay,
                        selectedMonth,
                        onSelectionChange: onSelectionChangeWrapper,
                    })
                }
                keyExtractor={(item) => item.index.toString()}
                getItemLayout={(data, index) => ({
                    length: DAY_PICKER_ELEMENT_WIDTH,
                    offset: DAY_PICKER_ELEMENT_WIDTH * index,
                    index,
                })}
                initialScrollIndex={selectedDay.index - 3}
            />
        </View>
    );
};
