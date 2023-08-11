import { View } from 'react-native';
import { useAppSelector } from 'src/redux/Hooks';
import { getGlobalBlurBackground } from 'src/redux/user/GlobalState';

export const ModalContainingComponent = () => {
    const globalBlurBackground = useAppSelector(getGlobalBlurBackground);

    return (
        <View
            style={{
                position: 'absolute',
                zIndex: globalBlurBackground ? 1 : -1,
                height: '110%',
                width: '100%',
                backgroundColor: globalBlurBackground ? 'rgba(000,000,000,.7)' : undefined,
            }}
        />
    );
};
