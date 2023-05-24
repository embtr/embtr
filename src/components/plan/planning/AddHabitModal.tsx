import { Modal } from 'react-native';
import { Tasks } from '../tasks/Tasks';
import { Screen } from 'src/components/common/Screen';
import SafeAreaView from 'react-native-safe-area-view';
import { Banner } from 'src/components/common/Banner';
import { RootSiblingParent } from 'react-native-root-siblings';
import { PlannedDay as PlannedDayModel } from 'resources/schema';

interface Props {
    visible: boolean;
    plannedDay: PlannedDayModel;
    dismiss: Function;
}

export const AddHabitModal = ({ visible, plannedDay, dismiss }: Props) => {
    const closeModal = () => {
        dismiss();
    };

    return (
        <Modal
            visible={visible}
            animationType={'slide'}
            onRequestClose={() => {
                dismiss();
            }}
        >
            <RootSiblingParent>
                <Screen>
                    <SafeAreaView forceInset={{ bottom: 'never' }}>
                        <Banner name="Add Activities" leftText="close" leftOnClick={closeModal} />
                        <Tasks plannedDay={plannedDay} />
                    </SafeAreaView>
                </Screen>
            </RootSiblingParent>
        </Modal>
    );
};
