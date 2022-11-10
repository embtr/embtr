import { View } from 'react-native';
import {
    DAILY_HISTORY_WIDGET,
    DAILY_HISTORY_WIDGET_DESCRIPTION,
    PILLARS_WIDGET,
    PILLARS_WIDGET_DESCRIPTION,
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

const getWidget = (name: string, description: string, isEnabled: Function, onToggle: Function) => {
    return (
        <View key={name} style={{ paddingTop: 5, width: '100%' }}>
            <WidgetMarketplaceToggle name={name} description={description} isEnabled={isEnabled(name)} onToggle={onToggle} />
        </View>
    );
};

export const getWidgets = (filter: string, isEnabled: Function, onToggle: Function): JSX.Element[] => {
    let widgetViews: JSX.Element[] = [];

    if (widgetMatchesFilter(TIME_LEFT_IN_DAY_WIDGET, filter)) {
        widgetViews.push(getWidget(TIME_LEFT_IN_DAY_WIDGET, TIME_LEFT_IN_DAY_WIDGET_DESCRIPTION, isEnabled, onToggle));
    }

    if (widgetMatchesFilter(QUOTE_OF_THE_DAY_WIDGET, filter)) {
        widgetViews.push(getWidget(QUOTE_OF_THE_DAY_WIDGET, QUOTE_OF_THE_DAY_WIDGET_DESCRIPTION, isEnabled, onToggle));
    }

    if (widgetMatchesFilter(TODAYS_TASKS_WIDGET, filter)) {
        widgetViews.push(getWidget(TODAYS_TASKS_WIDGET, TODAYS_TASKS_WIDGET_DESCRIPTION, isEnabled, onToggle));
    }

    if (widgetMatchesFilter(TODAYS_NOTES_WIDGET, filter)) {
        widgetViews.push(getWidget(TODAYS_NOTES_WIDGET, TODAYS_NOTES_WIDGET_DESCRIPTION, isEnabled, onToggle));
    }

    if (widgetMatchesFilter(TODAYS_PHOTOS_WIDGET, filter)) {
        widgetViews.push(getWidget(TODAYS_PHOTOS_WIDGET, TODAYS_PHOTOS_WIDGET_DESCRIPTION, isEnabled, onToggle));
    }

    if (widgetMatchesFilter(UPCOMING_GOALS_WIDGET, filter)) {
        widgetViews.push(getWidget(UPCOMING_GOALS_WIDGET, UPCOMING_GOALS_WIDGET_DESCRIPTION, isEnabled, onToggle));
    }

    if (widgetMatchesFilter(DAILY_HISTORY_WIDGET, filter)) {
        widgetViews.push(getWidget(DAILY_HISTORY_WIDGET, DAILY_HISTORY_WIDGET_DESCRIPTION, isEnabled, onToggle));
    }

    if (widgetMatchesFilter(PILLARS_WIDGET, filter)) {
        widgetViews.push(getWidget(PILLARS_WIDGET, PILLARS_WIDGET_DESCRIPTION, isEnabled, onToggle));
    }

    return widgetViews;
};
