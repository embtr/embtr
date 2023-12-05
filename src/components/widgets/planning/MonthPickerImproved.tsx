import React from 'react';
import { FlatList, Animated, Easing } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { CurrentMonthText } from 'src/components/plan/planning/CurrentMonthText';
import { TIMELINE_CARD_PADDING } from 'src/util/constants';
import { MonthPickerElementImproved } from './MonthPickerElementImproved';
import { MONTHS, MonthPickerElementData } from 'src/model/PlanningWidget';

const styles = StyleSheet.create({
    animatedContainer: { overflow: 'hidden', alignItems: 'flex-end', justifyContent: 'flex-end' },
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
    selectedIndex,
    onSelectionChange,
}: {
    item: MonthPickerElementData;
    selectedIndex: number;
    onSelectionChange: Function;
}) => (
    <MonthPickerElementImproved
        elementData={item}
        isSelected={selectedIndex === item.index}
        onSelect={(index: number) => {
            onSelectionChange(index);
        }}
    />
);

interface Props {
    selectedIndex: number;
    onSelectionChange: Function;
}

export const MonthPickerImproved = ({ selectedIndex, onSelectionChange }: Props) => {
    const [advancedOptionsHeight] = React.useState<Animated.Value>(
        new Animated.Value(0)
    );
    const [advancedVisible, setAdvancedVisible] = React.useState<boolean>(false);

    return (
        <View>
            {/* display the current month */}
            <CurrentMonthText
                onPress={() => {
                    runAnimation(!advancedVisible, advancedOptionsHeight);
                    setAdvancedVisible(!advancedVisible);
                }}
                month={MONTHS[selectedIndex].month}
                advancedVisible={advancedVisible}
            />

            {/* collapsable month selector */}
            <Animated.View style={[styles.animatedContainer, { height: advancedOptionsHeight }]}>
                <View style={{ paddingTop: TIMELINE_CARD_PADDING / 2 }}>
                    <FlatList
                    showsHorizontalScrollIndicator={false}
                        horizontal
                        data={MONTHS}
                        renderItem={(item) =>
                            renderItem({ item: item.item, selectedIndex, onSelectionChange })
                        }
                        keyExtractor={(item) => item.index.toString()}
                    />
                </View>
            </Animated.View>
        </View>
    );
};
