import React from 'react';
import { View } from 'react-native';
import { useAppDispatch } from 'src/redux/Hooks';
import { setGlobalBlurBackground } from 'src/redux/user/GlobalState';

interface Props {
    children: any;
    visible: boolean;
}

export const ModalBase = ({ children, visible }: Props) => {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(setGlobalBlurBackground(visible));
    }, [visible]);

    return <View>{children}</View>;
};
