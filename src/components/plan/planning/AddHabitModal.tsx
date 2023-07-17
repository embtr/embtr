import { Modal, View } from 'react-native';
import { Tasks } from '../tasks/Tasks';
import SafeAreaView from 'react-native-safe-area-view';
import { Banner } from 'src/components/common/Banner';
import { RootSiblingParent } from 'react-native-root-siblings';
import { PlannedDay as PlannedDayModel } from 'resources/schema';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    visible: boolean;
    plannedDay: PlannedDayModel;
    dismiss: Function;
}

export const AddHabitModal = ({ visible, plannedDay, dismiss }: Props) => {
    const { colors } = useTheme();

    const closeModal = () => {
        dismiss();
    };

    return (
        <Modal
            visible={visible}
            animationType={'slide'}
            onRequestClose={() => {
                closeModal();
            }}
        >
            <RootSiblingParent>
                <SafeAreaView
                    style={{ backgroundColor: colors.background }}
                    forceInset={{ bottom: 'never' }}
                >
                    <View style={{ height: '100%', width: '100%' }}>
                        <Banner name="Add Activities" leftText="close" leftOnClick={closeModal} />
                        <Tasks plannedDay={plannedDay} />
                    </View>
                </SafeAreaView>
            </RootSiblingParent>
        </Modal>
    );
};
