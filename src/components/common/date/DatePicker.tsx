import { isAndroidDevice } from 'src/util/DeviceUtil';
import { AndroidDatePicker } from './AndroidDatePicker';
import { IOSDatePicker } from './IOSDatePicker';
import { View } from 'react-native';

interface Props {
    visible: boolean;
    date: Date;
    onConfirm: (date: Date) => void;
    onCancel: () => void;
}

export const DatePicker = ({ visible, date, onConfirm, onCancel }: Props) => {
    if (isAndroidDevice()) {
        if (!visible) {
            return <View />;
        }

        return <AndroidDatePicker date={date} onConfirm={onConfirm} onCancel={onCancel} />;
    } else {
        return (
            <IOSDatePicker
                date={date}
                onConfirm={onConfirm}
                onCancel={onCancel}
                visible={visible}
            />
        );
    }
};
