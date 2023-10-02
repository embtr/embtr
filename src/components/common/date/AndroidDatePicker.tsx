import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

interface Props {
    date: Date;
    onConfirm: (date: Date) => void;
    onCancel: () => void;
}

export const AndroidDatePicker = ({ date, onConfirm, onCancel }: Props) => {
    return (
        <RNDateTimePicker
            display="default"
            value={date}
            mode={'date'}
            onChange={(event: DateTimePickerEvent, updatedDate?: Date) => {
                if (event.type === 'set') {
                    onConfirm(updatedDate || date);
                } else if (event.type === 'dismissed') {
                    onCancel();
                }
            }}
        />
    );
};
