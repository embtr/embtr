import { View } from 'react-native';
import { Screen } from 'src/components/common/Screen';
import { Banner } from 'src/components/common/Banner';
import { ConfigureWidgetToggle } from './ConfigureWidgetToggle';
import React from 'react';
import UserController, { UserModel } from 'src/controller/user/UserController';
import { QUOTE_OF_THE_DAY_WIDGET, TIME_LEFT_IN_DAY_WIDGET, TODAYS_PHOTOS_WIDGET, TODAYS_TASKS_WIDGET, WIDGETS } from 'src/util/constants';
import { ScrollView } from 'react-native-gesture-handler';

export const ConfigureWidgets = () => {
    const [user, setUser] = React.useState<UserModel>();

    React.useEffect(() => {
        const fetch = async () => {
            const user = await UserController.getCurrentUser();
            setUser(user);
        };

        fetch();
    }, []);

    const onToggle = (name: string, enabled: boolean) => {
        if (!user) {
            return;
        }

        let enabledWidgets: string[] = [];
        WIDGETS.forEach((widget) => {
            if (widget === name) {
                if (enabled) {
                    enabledWidgets.push(name);
                }
            } else if (user.today_widgets?.includes(widget)) {
                enabledWidgets.push(widget);
            }
        });

        let clonedUser = UserController.clone(user);
        clonedUser.today_widgets = enabledWidgets;
        UserController.update(clonedUser);
        setUser(clonedUser);
    };

    const isEnabled = (name: string) => {
        return user?.today_widgets?.includes(name) === true;
    };

    return (
        <Screen>
            <Banner name="Widgets" rightText={'close'} rightRoute="BACK" />

            <ScrollView>
                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                    <View style={{ paddingTop: 10 }}>
                        <ConfigureWidgetToggle name={TIME_LEFT_IN_DAY_WIDGET} isEnabled={isEnabled(TIME_LEFT_IN_DAY_WIDGET)} onToggle={onToggle} />
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        <ConfigureWidgetToggle name={QUOTE_OF_THE_DAY_WIDGET} isEnabled={isEnabled(QUOTE_OF_THE_DAY_WIDGET)} onToggle={onToggle} />
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        <ConfigureWidgetToggle name={TODAYS_TASKS_WIDGET} isEnabled={isEnabled(TODAYS_TASKS_WIDGET)} onToggle={onToggle} />
                    </View>
                    <View style={{ paddingTop: 5 }}>
                        <ConfigureWidgetToggle name={TODAYS_PHOTOS_WIDGET} isEnabled={isEnabled(TODAYS_PHOTOS_WIDGET)} onToggle={onToggle} />
                    </View>
                </View>
            </ScrollView>
        </Screen>
    );
};
