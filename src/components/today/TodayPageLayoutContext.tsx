import React from 'react';
import { createContext } from 'react';

interface TodayPageLayoutProps {
    planningWidgetHeight: number;

    dayPickerHeight: number;
    setDayPickerHeight: (height: number) => void;

    widgetTitleHeight: number;
    setWidgetTitleHeight: (height: number) => void;
}

export const TodayPageLayoutContext = createContext<TodayPageLayoutProps>(undefined!);

interface TodayPageLayoutContextProviderProps {
    children: React.ReactNode;
    planningWidgetHeight: number;
}

export const TodayPageLayoutContextProvider = ({
    children,
    planningWidgetHeight,
}: TodayPageLayoutContextProviderProps) => {
    const [dayPickerHeight, setDayPickerHeight] = React.useState(0);
    const [widgetTitleHeight, setWidgetTitleHeight] = React.useState<number>(0);

    const contextValue: TodayPageLayoutProps = {
        planningWidgetHeight,
        dayPickerHeight,
        setDayPickerHeight,
        widgetTitleHeight,
        setWidgetTitleHeight,
    };

    return (
        <TodayPageLayoutContext.Provider value={contextValue}>
            {children}
        </TodayPageLayoutContext.Provider>
    );
};
