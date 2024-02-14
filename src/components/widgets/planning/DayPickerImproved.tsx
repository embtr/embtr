import { FlatList } from 'react-native';
import { View } from 'react-native';
import {
    DAY_PICKER_ELEMENT_WIDTH,
    MemoizedDayPickerElementImproved,
} from './DayPickerElementImproved';
import { DayPickerElementData, MonthPickerElementData } from 'src/model/PlanningWidget';
import React from 'react';

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
    isToday,
}: {
    item: DayPickerElementData;
    selectedDay: DayPickerElementData;
    selectedMonth: MonthPickerElementData;
    onSelectionChange: Function;
    isToday: boolean;
}) => {
    return (
        <MemoizedDayPickerElementImproved
            elementData={item}
            isSelected={selectedDay.index === item.index}
            monthIndex={selectedMonth.index}
            onSelect={(day: DayPickerElementData) => {
                onSelectionChange(day);
            }}
            isToday={isToday}
        />
    );
};

const scrollToSelected = (flatListRef: React.RefObject<FlatList>, index: number) => {
    flatListRef.current?.scrollToIndex({
        index: index,
        animated: true,
        viewPosition: 0.5, // Centers the selected item
    });
};

export const DayPickerImproved = React.forwardRef(
    ({ selectedDay, selectedMonth, onSelectionChange, daysOfTheMonth }: Props, ref: any) => {
        const onSelectionChangeWrapper = (day: DayPickerElementData) => {
            scrollToSelected(ref, day.index);
            onSelectionChange(day);
        };

        const currentMonth = new Date().getMonth() + 1;
        const currentDay = new Date().getDate();

        const zeroPaddedMonth = selectedMonth.month.toString().padStart(2, '0');
        const key = `${selectedMonth.year}${zeroPaddedMonth}`;
        const days = daysOfTheMonth.get(key);

        return (
            <View>
                {/* <FlashList */}
                <FlatList
                    ref={ref}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={days}
                    renderItem={(item) => {
                        const isToday =
                            selectedMonth.month + 1 === currentMonth &&
                            item.item.displayNumber === currentDay;

                        return render({
                            item: item.item,
                            selectedDay,
                            selectedMonth,
                            onSelectionChange: onSelectionChangeWrapper,
                            isToday: isToday,
                        });
                    }}
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
    }
);
