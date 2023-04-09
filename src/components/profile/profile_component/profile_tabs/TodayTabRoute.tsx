import { View } from 'react-native';
import { User } from 'resources/schema';
import { TodaysTasksWidget } from 'src/components/widgets/TodaysTasksWidget';

interface Props {
    user: User;
}

export const TodayTabRoute = ({ user }: Props) => {
    return (
        <View style={{ width: '100%' }}>
            <TodaysTasksWidget user={user} />
        </View>
    );
};
