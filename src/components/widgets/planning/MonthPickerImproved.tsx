import React from 'react';
import { FlatList, Animated, Easing } from 'react-native';
import { View, StyleSheet } from 'react-native';
import { CurrentMonthText } from 'src/components/plan/planning/CurrentMonthText';
import { PADDING_LARGE } from 'src/util/constants';
import { MonthPickerElementImproved } from './MonthPickerElementImproved';
import { MonthPickerElementData } from 'src/model/PlanningWidget';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';

const styles = StyleSheet.create({
    animatedContainer: { overflow: 'hidden', width: '100%' },
});

const ANIMATION_HEIGHT = PADDING_LARGE * 3 - PADDING_LARGE / 2;

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

interface Props {
    allMonths: MonthPickerElementData[];
    selectedMonth: MonthPickerElementData;
    onSelectionChange: Function;
    onScrollToToday: () => void;
}

export const MonthPickerImproved = React.forwardRef(
    ({ allMonths, selectedMonth, onSelectionChange, onScrollToToday }: Props, ref: any) => {
        const navigation = useEmbtrNavigation();

        const [advancedOptionsHeight] = React.useState<Animated.Value>(new Animated.Value(0));
        const [advancedVisible, setAdvancedVisible] = React.useState<boolean>(false);

        const onSelectionChangeWrapper = (month: MonthPickerElementData) => {
            onSelectionChange(month);
        };

        const scroll = (animated: boolean) => {
            if (selectedMonth.index === undefined) {
                return;
            }

            if (!advancedVisible) {
                return;
            }

            if (!ref.current) {
                return;
            }

            ref.current?.scrollToIndex({
                index: selectedMonth.index,
                animated: animated,
                viewPosition: 0.5,
            });
        };

        React.useEffect(() => {
            setTimeout(() => {
                scroll(false);
            }, 0);
        }, [advancedVisible]);

        React.useEffect(() => {
            setTimeout(() => {
                scroll(true);
            }, 0);
        }, [selectedMonth]);

        return (
            <View style={{ width: '100%' }}>
                {/* display the current month */}
                <CurrentMonthText
                    onPress={() => {
                        runAnimation(!advancedVisible, advancedOptionsHeight);
                        setAdvancedVisible(!advancedVisible);
                    }}
                    month={selectedMonth.monthString}
                    advancedVisible={advancedVisible}
                    scrollToToday={onScrollToToday}
                    navigateToCreateHabit={() => {
                        navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT_SLIDE_UP, {
                            isCreateCustomHabit: true,
                        });
                    }}
                />

                {/* collapsable month selector */}
                <Animated.View
                    style={[styles.animatedContainer, { height: advancedOptionsHeight }]}
                >
                    <View style={{ paddingTop: PADDING_LARGE / 2 }}>
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
