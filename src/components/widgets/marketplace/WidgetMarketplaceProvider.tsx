import { View } from 'react-native';
import {
    QUOTE_OF_THE_DAY_WIDGET,
    QUOTE_OF_THE_DAY_WIDGET_DESCRIPTION,
    TIME_LEFT_IN_DAY_WIDGET,
    TIME_LEFT_IN_DAY_WIDGET_DESCRIPTION,
    TODAYS_NOTES_WIDGET,
    TODAYS_NOTES_WIDGET_DESCRIPTION,
    TODAYS_PHOTOS_WIDGET,
    TODAYS_PHOTOS_WIDGET_DESCRIPTION,
    TODAYS_TASKS_WIDGET,
    TODAYS_TASKS_WIDGET_DESCRIPTION,
    UPCOMING_GOALS_WIDGET,
    UPCOMING_GOALS_WIDGET_DESCRIPTION,
} from 'src/util/constants';
import { WidgetMarketplaceToggle } from './WidgetMarketplaceToggle';

const widgetMatchesFilter = (widgetName: string, filter: string) => {
    if (!filter || filter.length == 0) {
        return true;
    }

    return widgetName.toUpperCase().includes(filter.toUpperCase());
};

export const getWidgets = (filter: string, isEnabled: Function, onToggle: Function): JSX.Element[] => {
    let widgetViews: JSX.Element[] = [];

    if (widgetMatchesFilter(TIME_LEFT_IN_DAY_WIDGET, filter)) {
        widgetViews.push(
            <View key={TIME_LEFT_IN_DAY_WIDGET} style={{ paddingTop: 5, width: '100%' }}>
                <WidgetMarketplaceToggle
                    name={TIME_LEFT_IN_DAY_WIDGET}
                    description={TIME_LEFT_IN_DAY_WIDGET_DESCRIPTION}
                    isEnabled={isEnabled(TIME_LEFT_IN_DAY_WIDGET)}
                    onToggle={onToggle}
                />
            </View>
        );
    }

    if (widgetMatchesFilter(QUOTE_OF_THE_DAY_WIDGET, filter)) {
        widgetViews.push(
            <View key={QUOTE_OF_THE_DAY_WIDGET} style={{ paddingTop: 5, width: '100%' }}>
                <WidgetMarketplaceToggle
                    name={QUOTE_OF_THE_DAY_WIDGET}
                    description={QUOTE_OF_THE_DAY_WIDGET_DESCRIPTION}
                    isEnabled={isEnabled(QUOTE_OF_THE_DAY_WIDGET)}
                    onToggle={onToggle}
                />
            </View>
        );
    }

    if (widgetMatchesFilter(TODAYS_TASKS_WIDGET, filter)) {
        widgetViews.push(
            <View key={TODAYS_TASKS_WIDGET} style={{ paddingTop: 5, width: '100%' }}>
                <WidgetMarketplaceToggle
                    name={TODAYS_TASKS_WIDGET}
                    description={TODAYS_TASKS_WIDGET_DESCRIPTION}
                    isEnabled={isEnabled(TODAYS_TASKS_WIDGET)}
                    onToggle={onToggle}
                />
            </View>
        );
    }

    if (widgetMatchesFilter(TODAYS_NOTES_WIDGET, filter)) {
        widgetViews.push(
            <View key={TODAYS_NOTES_WIDGET} style={{ paddingTop: 5, width: '100%' }}>
                <WidgetMarketplaceToggle
                    name={TODAYS_NOTES_WIDGET}
                    description={TODAYS_NOTES_WIDGET_DESCRIPTION}
                    isEnabled={isEnabled(TODAYS_NOTES_WIDGET)}
                    onToggle={onToggle}
                />
            </View>
        );
    }

    if (widgetMatchesFilter(TODAYS_PHOTOS_WIDGET, filter)) {
        widgetViews.push(
            <View key={TODAYS_PHOTOS_WIDGET} style={{ paddingTop: 5, width: '100%' }}>
                <WidgetMarketplaceToggle
                    name={TODAYS_PHOTOS_WIDGET}
                    description={TODAYS_PHOTOS_WIDGET_DESCRIPTION}
                    isEnabled={isEnabled(TODAYS_PHOTOS_WIDGET)}
                    onToggle={onToggle}
                />
            </View>
        );
    }

    if (widgetMatchesFilter(UPCOMING_GOALS_WIDGET, filter)) {
        widgetViews.push(
            <View key={UPCOMING_GOALS_WIDGET} style={{ paddingTop: 5, width: '100%' }}>
                <WidgetMarketplaceToggle
                    name={UPCOMING_GOALS_WIDGET}
                    description={UPCOMING_GOALS_WIDGET_DESCRIPTION}
                    isEnabled={isEnabled(UPCOMING_GOALS_WIDGET)}
                    onToggle={onToggle}
                />
            </View>
        );
    }

    return widgetViews;
};
