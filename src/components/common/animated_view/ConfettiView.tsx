import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import React from 'react';
import { setFireConfetti } from 'src/redux/user/GlobalState';
import { useAppDispatch } from 'src/redux/Hooks';

export const ConfettiView = () => {
    const animation = React.useRef<LottieView>(null);
    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch(
            setFireConfetti(() => {
                animation.current?.play();
            })
        );
    }, []);

    return (
        <View
            style={{
                width: '100%',
                height: '100%',
                zIndex: 1,
                position: 'absolute',
                justifyContent: 'center',
                alignContent: 'center',
                alignItems: 'center',
            }}
            pointerEvents="none"
        >
            <LottieView
                autoPlay={false}
                loop={false}
                ref={animation}
                style={{ width: '140%', justifyContent: 'center' }}
                source={require('../../../../resources/lottie-confetti.json')}
            />
        </View>
    );
};
