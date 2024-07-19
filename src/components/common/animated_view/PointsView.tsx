import { View } from 'react-native';
import React from 'react';
import { setFirePoints } from 'src/redux/user/GlobalState';
import { useAppDispatch } from 'src/redux/Hooks';
import { AnimatedPointsView } from './AnimatedPointsView';

const createPointsView = (amount: number) => {
    return (
        <AnimatedPointsView
            sign={amount >= 0 ? '+' : '-'}
            amount={Math.abs(amount)}
            key={Math.random()}
        />
    );
};

export const PointsView = () => {
    const dispatch = useAppDispatch();
    const [views, setViews] = React.useState<Map<string, JSX.Element>>(new Map());

    const firePoints = (amount: number) => {
        const randomId = Math.random().toString();
        const removeView = () => {
            setViews((prevViews) => {
                const clone = new Map(prevViews);
                clone.delete(randomId);
                return clone;
            });
        };

        const newView = createPointsView(amount);
        setViews((prevViews) => {
            const clone = new Map(prevViews);
            clone.set(randomId, newView);
            return clone;
        });

        setTimeout(() => {
            removeView();
        }, 4500);
    };

    React.useEffect(() => {
        dispatch(setFirePoints(firePoints));
    }, []);

    return (
        <View
            style={{
                width: '100%',
                height: '100%',
                zIndex: 1,
                position: 'absolute',
            }}
            pointerEvents="none"
        >
            <View>{Array.from(views.values()).map((view) => view)}</View>
        </View>
    );
};
