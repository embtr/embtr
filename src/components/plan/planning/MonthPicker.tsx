import React, { useRef, createRef } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Animated, Easing, View, Text, TouchableOpacity } from 'react-native';
import {
    getDayKeyForSelectedMonth,
    getMonthFromDayKey,
} from 'src/controller/planning/PlannedDayController';
import { getSelectedDayKey, setSelectedDayKey } from 'src/redux/user/GlobalState';
import { POPPINS_SEMI_BOLD, TIMELINE_CARD_PADDING } from 'src/util/constants';
import { MonthPickerElement } from './MonthPickerElement';
import { useAppDispatch, useAppSelector } from 'src/redux/Hooks';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

const SCROLL_CENTER = 0.5;

const currentDate = new Date();
const monthElements = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
const initialSelectedDay = currentDate.getDate() - 1;

const createItemRefs = (length: number) => {
    return Array(length)
        .fill(null)
        .map(() => createRef<any>());
};

const MAX_HEIGHT = TIMELINE_CARD_PADDING + TIMELINE_CARD_PADDING;

const runAnimation = (expand: boolean, viewHeight: Animated.Value) => {
    Animated.timing(viewHeight, {
        toValue: expand ? MAX_HEIGHT : 0, // Set the desired height
        duration: 125, // Adjust the duration as needed
        easing: Easing.ease, // Adjust the easing function as needed
        useNativeDriver: false, // Make sure to set this to false for height animation
    }).start();
};

export const MonthPicker = () => {
    const flatListRef = useRef<FlatList>(null);
    const itemRefs = useRef<Array<any>>(createItemRefs(monthElements.length));
    const previouslySelectedRef = useRef<number>(initialSelectedDay);
    const [advancedVisible, setAdvancedVisible] = React.useState(false);
    const [currentlySelectedIndex, setCurrentlySelectedIndex] =
        React.useState<number>(initialSelectedDay);
    const { colors } = useTheme();
    const dispatch = useAppDispatch();

    const selectedDayKey = useAppSelector(getSelectedDayKey);

    const [advancedOptionsHeight] = React.useState<Animated.Value>(new Animated.Value(MAX_HEIGHT));

    React.useEffect(() => {
        runAnimation(advancedVisible, advancedOptionsHeight);
    }, [advancedVisible]);

    const scrollToSelected = (monthIndex: number) => {
        flatListRef.current?.scrollToIndex({
            index: monthIndex,
            animated: true,
            viewPosition: SCROLL_CENTER, // Centers the selected item
        });
    };

    const onMonthChange = (monthIndex: number) => {
        setCurrentlySelectedIndex(monthIndex);

        const newSelectedDayKey = getDayKeyForSelectedMonth(selectedDayKey, monthIndex + 1);
        dispatch(setSelectedDayKey(newSelectedDayKey));
    };

    const onSelectionChange = (monthIndex: number) => {
        scrollToSelected(monthIndex);

        const previousRef = itemRefs.current[previouslySelectedRef.current];
        if (previousRef?.current) {
            previousRef.current.clearSelected();
        }

        const currentRef = itemRefs.current[monthIndex];
        if (currentRef?.current) {
            currentRef.current.setSelected();
        }

        previouslySelectedRef.current = monthIndex;
        onMonthChange(monthIndex);
    };

    const renderDayPickerElement = ({ item, index }: { item: string; index: number }) => {
        const ref = itemRefs.current[index];
        return (
            <View style={{ paddingHorizontal: TIMELINE_CARD_PADDING / 2 }}>
                <MonthPickerElement
                    ref={ref}
                    item={item}
                    index={index}
                    isSelected={index === initialSelectedDay}
                    onSelectionChange={onSelectionChange}
                />
            </View>
        );
    };

    return (
        <View>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>
                    Planning for{' '}
                </Text>
                <TouchableOpacity onPress={() => setAdvancedVisible(!advancedVisible)}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text
                            style={{
                                color: colors.accent_color,
                                fontFamily: POPPINS_SEMI_BOLD,
                                fontSize: 15,
                            }}
                        >
                            {monthElements[currentlySelectedIndex]}
                        </Text>
                        <View
                            style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingLeft: TIMELINE_CARD_PADDING / 4,
                            }}
                        >
                            <Ionicons
                                name={advancedVisible ? 'chevron-up' : 'chevron-down'}
                                size={16}
                                color={colors.text}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <Animated.View
                style={{
                    overflow: 'hidden',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                    height: advancedOptionsHeight,
                }}
            >
                <FlatList
                    ref={flatListRef}
                    data={monthElements}
                    horizontal
                    removeClippedSubviews={true}
                    maxToRenderPerBatch={8}
                    windowSize={11}
                    initialNumToRender={monthElements.length}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    renderItem={renderDayPickerElement}
                    initialScrollIndex={initialSelectedDay}
                />
            </Animated.View>
        </View>
    );
};
