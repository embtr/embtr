import { View } from 'react-native';
import LottieView from 'lottie-react-native';
import React from 'react';
import { setFireConfetti } from 'src/redux/user/GlobalState';
import { useAppDispatch } from 'src/redux/Hooks';
import { getWindowHeight, getWindowWidth } from 'src/util/GeneralUtility';

const createLottiView = (removeView: () => void) => {
    return (
        <LottieView
            key={Math.random()}
            autoPlay={true}
            loop={false}
            onAnimationFinish={removeView}
            style={{
                zIndex: 1000,
                position: 'absolute',
                width: getWindowWidth(),
                height: getWindowHeight(),
            }}
            source={require('../../../../resources/lottie-confetti.json')}
        />
    );
};

export const ConfettiView = () => {
    const dispatch = useAppDispatch();
    const [views, setViews] = React.useState<Map<string, JSX.Element>>(new Map());

    const fireConfetti = () => {
        const randomId = Math.random().toString();
        const removeView = () => {
            setViews((prevViews) => {
                const clone = new Map(prevViews);
                clone.delete(randomId);
                return clone;
            });
        };

        const newView = createLottiView(removeView);
        setViews((prevViews) => {
            const clone = new Map(prevViews);
            clone.set(randomId, newView);
            return clone;
        });
    };

    React.useEffect(() => {
        dispatch(setFireConfetti(fireConfetti));
    }, [views]);

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
            {Array.from(views.values()).map((view) => view)}
        </View>
    );
};
