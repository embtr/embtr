import { FlatList } from 'react-native';
import { View } from 'react-native';
import {
    DAY_PICKER_ELEMENT_WIDTH,
    MemoizedDayPickerElementImproved,
} from './DayPickerElementImproved';
import { DayPickerElementData } from 'src/model/PlanningWidget';
import { SETTINGS_MENU_ITEM_WIDTH } from 'src/util/constants';

const getFirstDayOfTheMonth = (month: number) => {
    switch (month) {
        case 0:
            return 'Sun';
        case 1:
            return 'Wed';
        case 2:
            return 'Wed';
        case 3:
            return 'Sat';
        case 4:
            return 'Mon';
        case 5:
            return 'Thu';
        case 6:
            return 'Sat';
        case 7:
            return 'Tue';
        case 8:
            return 'Fri';
        case 9:
            return 'Sun';
        case 10:
            return 'Wed';
        case 11:
            return 'Fri';
        default:
            return 'Mon';
    }
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getOrderedDaysOfTheMonth = (monthIndex: number) => {
    const firstDay = getFirstDayOfTheMonth(monthIndex);
    const firstDayIndex = DAYS.indexOf(firstDay);
    const daysInOrder = DAYS.slice(firstDayIndex).concat(DAYS.slice(0, firstDayIndex));

    return daysInOrder;
};

const getNumberOfDaysInMonth = (monthIndex: number) => {
    switch (monthIndex) {
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            return 31;
        case 1:
            return 28;
        case 3:
        case 5:
        case 8:
        case 10:
            return 30;
        default:
            return 31;
    }
};

const getDaysInMonth = (monthIndex: number): DayPickerElementData[] => {
    const daysInOrder = getOrderedDaysOfTheMonth(monthIndex);
    const numberOfDaysInMonth = getNumberOfDaysInMonth(monthIndex);

    const days: DayPickerElementData[] = [];
    for (let i = 0; i < numberOfDaysInMonth; i++) {
        const dayType = {
            day: daysInOrder[i % 7],
            displayNumber: i + 1,
            index: i,
        };
        days.push(dayType);
    }

    return days;
};

interface Props {
    selectedDayIndex: number;
    selectedMonthIndex: number;
    onSelectionChange: Function;
}

const render = ({
    item,
    selectedDayIndex,
    selectedMonthIndex,
    onSelectionChange,
}: {
    item: DayPickerElementData;
    selectedDayIndex: number;
    selectedMonthIndex: number;
    onSelectionChange: Function;
}) => (
    <MemoizedDayPickerElementImproved
        elementData={item}
        isSelected={selectedDayIndex === item.index}
        monthIndex={selectedMonthIndex}
        onSelect={(index: number) => {
            onSelectionChange(index);
        }}
    />
);

export const DayPickerImproved = ({
    selectedDayIndex,
    selectedMonthIndex,
    onSelectionChange,
}: Props) => {
    const days = getDaysInMonth(selectedMonthIndex);

    return (
        <View>
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={days}
                renderItem={(item) =>
                    render({
                        item: item.item,
                        selectedDayIndex,
                        selectedMonthIndex,
                        onSelectionChange,
                    })
                }
                keyExtractor={(item) => item.index.toString()}
                getItemLayout={(data, index) => ({
                    length: DAY_PICKER_ELEMENT_WIDTH,
                    offset: DAY_PICKER_ELEMENT_WIDTH * index,
                    index,
                })}
            />
        </View>
    );
};
