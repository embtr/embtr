import { View } from 'react-native';
import { User } from 'resources/schema';
import { TodaysActivitiesWidget, WidgetSource } from 'src/components/widgets/TodaysTasksWidget';

interface Props {
    user: User;
    setHeight: Function;
}

export const TodayTabRoute = ({ user, setHeight }: Props) => {
    return (
        <View
            style={{ width: '100%' }}
            onLayout={(e) => {
                setHeight(e.nativeEvent.layout.height);
            }}
        >
            {/*
            <TodaysActivitiesWidget user={user} source={WidgetSource.PROFILE} />
        */}

            <View style={{backgroundColor: "blue", width: "100%", height: 800, borderWidth: 3, borderColor: "red"}} />
        </View>
    );
};
