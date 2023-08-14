import { View } from 'react-native';
import { Tasks } from '../tasks/Tasks';
import { Banner } from 'src/components/common/Banner';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import { useAppSelector } from 'src/redux/Hooks';
import { getCurrentlySelectedPlannedDay } from 'src/redux/user/GlobalState';

export const AddTasks = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    const selectedPlannedDay = useAppSelector(getCurrentlySelectedPlannedDay);

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

                <Tasks plannedDay={selectedPlannedDay} />
            </View>
        </Screen>
    );
};
