import { FlatList } from 'react-native';
import { View } from 'react-native';
import { MemoizedDayPickerElementImproved } from './DayPickerElementImproved';
import { DayPickerElementData } from 'src/model/PlanningWidget';

const getMonthFirstDay = (month: number) => {
    switch (month) {
        case 1:
            return 'Sun';
        case 2:
            return 'Wed';
        case 3:
            return 'Wed';
        case 4:
            return 'Sat';
        case 5:
            return 'Mon';
        case 6:
            return 'Thu';
        case 7:
            return 'Sat';
        case 8:
            return 'Tue';
        case 9:
            return 'Fri';
        case 10:
            return 'Sun';
        case 11:
            return 'Wed';
        case 12:
            return 'Fri';
        default:
            return 'Mon';
    }
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const getDaysInOrder = (month: number) => {
    const firstDay = getMonthFirstDay(month);
    const firstDayIndex = DAYS.indexOf(firstDay);
    const daysInOrder = DAYS.slice(firstDayIndex).concat(DAYS.slice(0, firstDayIndex));

    return daysInOrder;
};

const getNumberOfDaysInMonth = (month: number) => {
    switch (month) {
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 2:
            return 28;
        case 4:
        case 6:
        case 9:
        case 11:
            return 30;
        default:
            return 31;
    }
};

const getDaysInMonth = (month: number): DayPickerElementData[] => {
    const daysInOrder = getDaysInOrder(month);
    const numberOfDaysInMonth = getNumberOfDaysInMonth(month);

    const days: DayPickerElementData[] = [];
    for (let i = 0; i < numberOfDaysInMonth; i++) {
        const dayType = {
            day: daysInOrder[i % 7],
            index: i + 1,
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
    const days = getDaysInMonth(selectedMonthIndex + 1);

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
            />
        </View>
    );
};
