import { HabitCategory } from 'resources/schema';
import { HabitCategoryCard } from './HabitCategoryCard';
import { Animated, Pressable, View, Text } from 'react-native';
import { HabitElement } from './HabitElement';
import React from 'react';

interface Props {
    habitCategory: HabitCategory;
}

export const HabitCategoryElement = ({ habitCategory }: Props) => {
    const height = React.useRef(new Animated.Value(0)).current;
    const [expanded, setExpanded] = React.useState<boolean>(false);

    React.useEffect(() => {
        Animated.timing(height, {
            toValue: expanded ? 200 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start();
    }, [expanded]);

    return (
        <Pressable
            onPress={() => {
                if (expanded === undefined) {
                    setExpanded(true);
                } else {
                    setExpanded(!expanded);
                }
            }}
        >
            <HabitCategoryCard habitCategory={habitCategory} expanded={expanded} />
            <Animated.View style={{ height: height, overflow: 'hidden' }}>
                <View>
                    <HabitElement
                        iconUrl="https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/habit_categories%2Fgratitude.svg?alt=media"
                        title="Go for a run"
                        description="hello"
                    />

                    <HabitElement
                        iconUrl="https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/habit_categories%2Fgratitude.svg?alt=media"
                        title="Go for a run"
                        description="hello"
                    />

                    <HabitElement
                        iconUrl="https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/habit_categories%2Fgratitude.svg?alt=media"
                        title="Go for a run"
                        description="hello"
                    />

                    <HabitElement
                        iconUrl="https://firebasestorage.googleapis.com/v0/b/embtr-app.appspot.com/o/habit_categories%2Fgratitude.svg?alt=media"
                        title="Go for a run"
                        description="hello"
                    />
                </View>
            </Animated.View>
        </Pressable>
    );
};
