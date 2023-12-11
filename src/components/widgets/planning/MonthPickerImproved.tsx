import React from 'react';
import { FlatList, Animated, Easing } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { CurrentMonthText } from 'src/components/plan/planning/CurrentMonthText';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { MonthPickerElementImproved } from './MonthPickerElementImproved';
import { MonthPickerElementData } from 'src/model/PlanningWidget';

const styles = StyleSheet.create({
    animatedContainer: { overflow: 'hidden', width: '100%' },
});

const ANIMATION_HEIGHT = TIMELINE_CARD_PADDING * 3 - TIMELINE_CARD_PADDING / 2;

const runAnimation = (expand: boolean, viewHeight: Animated.Value) => {
    Animated.timing(viewHeight, {
        toValue: expand ? ANIMATION_HEIGHT : 0, // Set the desired height
        duration: 125, // Adjust the duration as needed
        easing: Easing.ease, // Adjust the easing function as needed
        useNativeDriver: false, // Make sure to set this to false for height animation
    }).start();
};

const renderItem = ({
    item,
    selectedMonth,
    onSelectionChange,
}: {
    item: MonthPickerElementData;
    selectedMonth: MonthPickerElementData;
    onSelectionChange: Function;
}) => (
    <MonthPickerElementImproved
        elementData={item}
        isSelected={selectedMonth.index === item.index}
        onSelect={(item: MonthPickerElementData) => {
            onSelectionChange(item);
        }}
    />
);

const scrollToSelected = (
    flatListRef: React.RefObject<FlatList>,
    month: MonthPickerElementData
) => {
    flatListRef.current?.scrollToIndex({
        index: month.index,
        animated: true,
        viewPosition: 0.5, // Centers the selected item
    });
};

interface Props {
    allMonths: MonthPickerElementData[];
    selectedMonth: MonthPickerElementData;
    onSelectionChange: Function;
    onScrollToToday: () => void;
}

export const MonthPickerImproved = React.forwardRef(
    ({ allMonths, selectedMonth, onSelectionChange, onScrollToToday }: Props, ref: any) => {
        const [advancedOptionsHeight] = React.useState<Animated.Value>(new Animated.Value(0));
        const [advancedVisible, setAdvancedVisible] = React.useState<boolean>(false);

        const onSelectionChangeWrapper = (month: MonthPickerElementData) => {
            scrollToSelected(ref, month);
            onSelectionChange(month);
        };

        return (
            <View style={{ width: '100%' }}>
                {/* display the current month */}
                <CurrentMonthText
                    onPress={() => {
                        scrollToSelected(ref, selectedMonth);
                        runAnimation(!advancedVisible, advancedOptionsHeight);
                        setAdvancedVisible(!advancedVisible);
                    }}
                    month={selectedMonth.monthString}
                    advancedVisible={advancedVisible}
                    scrollToToday={onScrollToToday}
                />

                {/* collapsable month selector */}
                <Animated.View
                    style={[styles.animatedContainer, { height: advancedOptionsHeight }]}
                >
                    <View style={{ paddingTop: TIMELINE_CARD_PADDING / 2 }}>
                        <FlatList
                            ref={ref}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            data={allMonths}
                            renderItem={(item) =>
                                renderItem({
                                    item: item.item,
                                    selectedMonth,
                                    onSelectionChange: onSelectionChangeWrapper,
                                })
                            }
                            keyExtractor={(item) => item.index.toString()}
                        />
                    </View>
                </Animated.View>
            </View>
        );
    }
);
