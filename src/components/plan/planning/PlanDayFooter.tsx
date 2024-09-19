import React, { useEffect, useRef } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PlannedDayCustomHooks } from 'src/controller/planning/PlannedDayController';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_MEDIUM } from 'src/util/constants';
import { Ionicons } from '@expo/vector-icons';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';
import { Routes } from 'src/navigation/RootStackParamList';
import { useAppSelector } from 'src/redux/Hooks';
import { getSelectedDayKey } from 'src/redux/user/GlobalState';
import { PlannedDayResultCustomHooks } from 'src/controller/timeline/daily_result/DailyResultController';

interface Props {
    dayKey: string;
    displayFooter: boolean;
    onPress: () => void;
    text: string;
    icon: string;
}

const PlanDayFooterImpl = ({ dayKey, displayFooter, onPress, text, icon }: Props) => {
    const colors = useTheme().colors;

    // Animation value to control the slide-up/slide-down
    const slideAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (displayFooter) {
            Animated.timing(slideAnim, {
                toValue: 1, // Fully visible
                duration: 300, // Duration of animation
                useNativeDriver: true, // Optimizes performance
            }).start();
        } else {
            // Slide down
            Animated.timing(slideAnim, {
                toValue: 0, // Fully hidden
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [displayFooter, slideAnim]);

    // Interpolating the animation value to translate Y axis
    const translateY = slideAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0], // Start from 100px below and slide to 0px (visible)
    });

    return (
        <Animated.View
            style={{
                position: 'absolute',
                zIndex: 1,
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                bottom: PADDING_LARGE * 2,
                transform: [{ translateY }], // Applying the translateY animation
            }}
        >
            <TouchableOpacity
                activeOpacity={0.7}
                style={{
                    padding: PADDING_LARGE * 0.75,
                    backgroundColor: colors.accent_color,
                    width: '97%',
                    alignItems: 'center',
                    borderRadius: 9,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 4,
                    elevation: 5, // For Android shadow
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
                onPress={() => {
                    onPress();
                }}
            >
                <View style={{ left: PADDING_SMALL, opacity: 0 }}>
                    <Ionicons name={icon as any} size={26} color={colors.text} />
                </View>

                <Text
                    style={{
                        color: colors.text,
                        fontFamily: POPPINS_MEDIUM,
                        fontSize: 16,
                    }}
                >
                    {text}
                </Text>

                <View style={{ right: PADDING_SMALL }}>
                    <Ionicons name={icon as any} size={26} color={colors.text} />
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const PlanDayFooter = () => {
    const navigation = useEmbtrNavigation();
    const dayKey = useAppSelector(getSelectedDayKey);
    const selectedPlannedDayIsComplete = PlannedDayCustomHooks.useSelectedPlannedDayIsComplete();

    const exists = PlannedDayResultCustomHooks.usePlannedDayResultExistsByDayKey(dayKey);
    const text = exists.data ? 'View Results' : 'Share Your Day';
    const icon = exists.data ? 'stats-chart' : 'paper-plane-outline';

    return (
        <PlanDayFooterImpl
            dayKey={dayKey}
            displayFooter={!exists.isLoading && (selectedPlannedDayIsComplete || !!exists.data)}
            text={text}
            icon={icon}
            onPress={() => {
                if (exists.data) {
                    navigation.navigate(Routes.PLANNED_DAY_RESULT_DETAILS, {
                        dayKey: dayKey ?? '',
                    });
                } else {
                    navigation.navigate(Routes.CREATE_PLANNED_DAY_RESULT, {
                        dayKey: dayKey ?? '',
                    });
                }
            }}
        />
    );
};
