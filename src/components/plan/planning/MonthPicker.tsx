import React, { useRef, createRef } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { Animated, Easing, View } from 'react-native';
import { getDayKeyForSelectedMonth } from 'src/controller/planning/PlannedDayController';
import { setSelectedDayKey } from 'src/redux/user/GlobalState';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { MonthPickerElement } from './MonthPickerElement';
import { useAppDispatch } from 'src/redux/Hooks';
import { CurrentMonthText } from './CurrentMonthText';

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
const initialSelectedMonth = currentDate.getMonth();

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

interface Props {
    dayKeyRef: React.MutableRefObject<string>;
    forceRerender: Function;
}

export const MemoizedMonthPicker = React.memo(
    ({ dayKeyRef, forceRerender }: Props) => {
        return <MonthPicker dayKeyRef={dayKeyRef} forceRerender={forceRerender} />;
    },
    (prevProps, nextProps) => {
        return true;
    }
);

export const MonthPicker = ({ dayKeyRef, forceRerender }: Props) => {
    console.log('RERENDERING MONTHP ICKER');
    const flatListRef = useRef<FlatList>(null);
    const itemRefs = useRef<Array<any>>(createItemRefs(monthElements.length));
    const previouslySelectedRef = useRef<number>(initialSelectedMonth);
    const [advancedVisible, setAdvancedVisible] = React.useState(false);
    const dispatch = useAppDispatch();
    const childRef = useRef<any>();

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
        const newSelectedDayKey = getDayKeyForSelectedMonth(dayKeyRef.current, monthIndex + 1);
        dayKeyRef.current = newSelectedDayKey;

        dispatch(setSelectedDayKey(newSelectedDayKey));
        forceRerender();
    };

    const onSelectionChange = (monthIndex: number) => {
        scrollToSelected(monthIndex);
        childRef.current?.changeMonth(monthElements[monthIndex]);

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
                    isSelected={index === initialSelectedMonth}
                    onSelectionChange={onSelectionChange}
                />
            </View>
        );
    };

    return (
        <View>
            <CurrentMonthText
                ref={childRef}
                onPress={() => setAdvancedVisible(!advancedVisible)}
                initialMonth={monthElements[initialSelectedMonth]}
                advancedVisible={advancedVisible}
            />

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
                    initialNumToRender={monthElements.length}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    renderItem={renderDayPickerElement}
                />
            </Animated.View>
        </View>
    );
};
