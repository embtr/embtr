import { View } from 'react-native';

interface Props {
    modalVisible: boolean;
}

export const ModalContainingComponent = ({ modalVisible }: Props) => {
    return (
        <View
            style={{
                position: 'absolute',
                zIndex: modalVisible ? 1 : -1,
                height: '100%',
                width: '100%',
                backgroundColor: modalVisible ? 'rgba(000,000,000,.7)' : undefined,
            }}
        />
    );
};
