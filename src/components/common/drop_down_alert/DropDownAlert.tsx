import React from 'react';
import { useRef } from 'react';
import { Animated, PanResponder, Text, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { DropDownAlertModal } from 'src/model/DropDownAlertModel';
import { useAppDispatch } from 'src/redux/Hooks';
import { setDisplayDropDownAlert } from 'src/redux/user/GlobalState';
import { CARD_SHADOW, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';

export const DropDownAlert = () => {
    const { colors } = useTheme();
    const position = useRef(new Animated.Value(-200)).current;
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [model, setModel] = React.useState<DropDownAlertModal>();

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (_, gestureState) => {
                return gestureState.dy < 0; // Only detect upward gestures
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy < -5) {
                    handleClose(50);
                }
            },
        })
    ).current;

    const displayAnimation = (model: DropDownAlertModal) => {
        handleClose(0);

        setModel(model);

        Animated.timing(position, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start();

        timeoutRef.current = setTimeout(() => {
            handleClose(300);
        }, 5000);

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    };

    const dispatch = useAppDispatch();
    React.useEffect(() => {
        dispatch(setDisplayDropDownAlert(displayAnimation));
    }, []);

    const handleClose = (duration: number) => {
        Animated.timing(position, {
            toValue: -200,
            duration,
            useNativeDriver: true,
        }).start(() => { });

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    return (
        <Animated.View
            {...panResponder.panHandlers}
            style={[
                {
                    position: 'absolute',
                    top: 50,
                    left: 5,
                    right: 5,
                    borderRadius: 5,
                    height: 80,
                    backgroundColor: colors.background_light,
                    justifyContent: 'center',
                    zIndex: 9999,
                },
                CARD_SHADOW,
                { transform: [{ translateY: position }] },
            ]}
        >
            <View
                style={{
                    flexDirection: 'row',
                    paddingLeft: 10,
                    alignItems: 'center',
                }}
            >
                <SvgUri width={50} height={50} uri={model?.icon.remoteImageUrl ?? ''} />
                <View>
                    <Text
                        style={{
                            paddingLeft: 10,
                            color: colors.text,
                            fontSize: 16,
                            fontFamily: POPPINS_REGULAR,
                        }}
                    >
                        {model?.title}
                    </Text>

                    <Text
                        style={{
                            paddingLeft: 10,
                            color: colors.tab_selected,
                            fontSize: 16,
                            fontFamily: POPPINS_MEDIUM,
                        }}
                    >
                        {model?.body}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};
