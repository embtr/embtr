import React from 'react';
import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { Planning } from './planning/Planning';
import { EmbtrMenuOption, createEmbtrMenuOptions } from '../common/menu/EmbtrMenuOption';
import { useAppSelector } from 'src/redux/Hooks';
import { getCloseMenu } from 'src/redux/user/GlobalState';
import PlannedDayController, {
    getDayKey,
    getTodayKey,
} from 'src/controller/planning/PlannedDayController';
import DailyResultController from 'src/controller/timeline/daily_result/DailyResultController';
import LottieView from 'lottie-react-native';
import { PlannedDay } from 'resources/schema';

/*
 * Avoid rerenders
 * https://github.com/satya164/react-native-tab-view#avoid-unnecessary-re-renders
 */

export const PlanMain = () => {
    const [showAddTaskModal, setShowAddTaskModal] = React.useState(false);
    const [plannedDay, setPlannedDay] = React.useState<PlannedDay>();
    const [selectedDayKey, setSelectedDayKey] = React.useState<string>(getTodayKey());

    const fetchPlannedDay = async () => {
        const plannedDay = await PlannedDayController.getForCurrentUserViaApi(selectedDayKey);
        setPlannedDay(plannedDay);
    };

    React.useEffect(() => {
        fetchPlannedDay();
    }, [selectedDayKey]);

    const onDayChanged = (day: number) => {
        const newDayKey = getDayKey(day);
        setSelectedDayKey(newDayKey);
    };

    const animation = React.useRef<LottieView>(null);
    const onConfetti = () => {
        animation.current?.play();
    };

    const navigateToTomorrowCreateTask = () => {
        setShowAddTaskModal(true);
    };

    const completeDay = async () => {
        if (plannedDay?.plannedDayResults?.length) {
            const plannedDayResult = plannedDay!.plannedDayResults![0];
            plannedDayResult.active = true;
            await DailyResultController.updateViaApi(plannedDayResult);
        } else if (plannedDay) {
            await PlannedDayController.completeDayViaApi(plannedDay);
        }
    };

    const closeMenu = useAppSelector(getCloseMenu);
    const menuItems: EmbtrMenuOption[] = [
        {
            name: 'Share Results',
            onPress: async () => {
                completeDay();
                closeMenu();
            },
        },
    ];

    return (
        <Screen>
            <View style={{ height: '100%' }}>
                <Banner
                    name={'Planning'}
                    leftIcon={'add'}
                    leftRoute={'CreateTask'}
                    leftOnClick={navigateToTomorrowCreateTask}
                    rightIcon={'ellipsis-horizontal'}
                    menuOptions={createEmbtrMenuOptions(menuItems)}
                />

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
                        source={require('../../../resources/lottie-confetti.json')}
                    />
                </View>
                <Planning
                    showSelectTaskModal={showAddTaskModal}
                    setShowSelectTaskModal={setShowAddTaskModal}
                    dismissSelectTaskModal={() => {
                        setShowAddTaskModal(false);
                    }}
                    onDayChange={onDayChanged}
                    selectedDayKey={selectedDayKey}
                    useCalendarView={false}
                    onCompleteDay={completeDay}
                    onAllTasksComplete={onConfetti}
                />
            </View>
        </Screen>
    );
};
