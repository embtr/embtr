import React, { useRef, createRef } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Dimensions } from 'react-native';
import { DayPickerElement } from './DayPickerElement';
import { getDayKey } from 'src/controller/planning/PlannedDayController';
import { useDispatch } from 'react-redux';
import { setSelectedDayKey } from 'src/redux/user/GlobalState';

/*
 * I had to use an imperial handle to access the setSelected and clearSelected methods.
 * This allows me to access several refs from the DayPickerElement component.
 * It also allows me to avoid rendering ontouched elements, including this parent element.
 */

const SCROLL_CENTER = 0.5;

const calculateItemWidth = () => Dimensions.get('window').width / 9.5;

const currentDate = new Date();
const numberOfDaysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
).getDate();
const dateElements = Array.from(Array(numberOfDaysInMonth).keys()).slice(1);
const initialSelectedDay = currentDate.getDate() - 1;

const createItemRefs = (length: number) => {
    return Array(length)
        .fill(null)
        .map(() => createRef<any>());
};

export const DayPicker = () => {
    const flatListRef = useRef<FlatList>(null);
    const itemRefs = useRef<Array<any>>(createItemRefs(dateElements.length));
    const previouslySelectedRef = useRef<number>(initialSelectedDay);

    const dispatch = useDispatch();

    const scrollToSelected = (day: number) => {
        flatListRef.current?.scrollToIndex({
            index: day,
            animated: true,
            viewPosition: SCROLL_CENTER, // Centers the selected item
        });
    };

    const onSelectionChange = (day: number) => {
        const newDayKey = getDayKey(day + 1);
        dispatch(setSelectedDayKey(newDayKey));

        scrollToSelected(day);

        const previousRef = itemRefs.current[previouslySelectedRef.current];
        previousRef.current.clearSelected();

        const ref = itemRefs.current[day];
        ref.current.setSelected();

        previouslySelectedRef.current = day;
    };

    const renderDayPickerElement = ({ item, index }: { item: number; index: number }) => {
        const ref = itemRefs.current[index];
        return (
            <DayPickerElement
                ref={ref}
                item={item}
                index={index}
                isSelected={index === initialSelectedDay}
                itemWidth={calculateItemWidth()}
                onSelectionChange={onSelectionChange}
            />
        );
    };

    return (
        <FlatList
            ref={flatListRef}
            data={dateElements}
            horizontal
            removeClippedSubviews={true}
            maxToRenderPerBatch={8}
            windowSize={11}
            initialNumToRender={dateElements.length}
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.toString()}
            renderItem={renderDayPickerElement}
            initialScrollIndex={initialSelectedDay}
            getItemLayout={(data, index) => ({
                length: calculateItemWidth(),
                offset: calculateItemWidth() * index,
                index,
            })}
        />
    );
};
