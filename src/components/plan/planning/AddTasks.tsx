import { View, Text } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentlySelectedPlannedDay } from 'src/redux/user/GlobalState';
import { SvgUri } from 'react-native-svg';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { CARD_SHADOW, POPPINS_REGULAR } from 'src/util/constants';
import { HabitCategory } from 'resources/schema';
import React from 'react';
import { HabitController } from 'src/controller/habit/HabitController';

export const AddTasks = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const { colors } = useTheme();

    const selectedPlannedDay = useAppSelector(getCurrentlySelectedPlannedDay);

    const [habitCategories, setHabitCategories] = React.useState<HabitCategory[]>([]);

    React.useEffect(() => {
        const fetch = async () => {
            const habitCategories = HabitController.getHabitCategories();
            if (havit)
    return (
        <Screen>
            <View style={{ height: '100%', width: '100%' }}>
                <Banner
                    name="Add Habits"
                    leftText="close"
                    leftOnClick={() => {
                        navigation.goBack();
                    }}
                />

                <View
                    style={{
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                </View>
            </View>
        </Screen>
    );
};
