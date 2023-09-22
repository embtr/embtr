import { View } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import { HabitController } from 'src/controller/habit/HabitController';

export const AddHabit = () => {
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, 'AddHabit'>>();

    const habitCategory = HabitController.useHabitCategory(Number(route.params.id));

    return (
        <Screen>
            <View style={{ height: '100%', width: '100%' }}>
                <Banner
                    name={habitCategory?.name ?? 'unfound'}
                    leftRoute="BACK"
                    leftIcon={'arrow-back'}
                />
            </View>
        </Screen>
    );
};
