import { HabitCategory } from 'resources/schema';
import { HabitCategoryCard } from './HabitCategoryCard';
import { Animated, Pressable, View } from 'react-native';
import { HabitElement } from './HabitElement';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from 'src/navigation/RootStackParamList';

interface Props {
    habitCategory: HabitCategory;
}

export const HabitCategoryElement = ({ habitCategory }: Props) => {
    const height = React.useRef(new Animated.Value(0)).current;
    const [expanded, setExpanded] = React.useState<boolean>(false);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

    /* handle UI expand/collapse */
    /*
    React.useEffect(() => {
        Animated.timing(height, {
            toValue: expanded ? 200 : 0,
            duration: 150,
            useNativeDriver: false,
        }).start();
    }, [expanded]);
    i*/

    const elements: JSX.Element[] = [];
    habitCategory.tasks?.forEach((task) => {
        elements.push(
            <View style={{ paddingHorizontal: 10 }}>
                <HabitElement
                    key={task.id}
                    iconUrl={habitCategory.imageUrl ?? ''}
                    title={task.title ?? ''}
                    description={task.description ?? ''}
                />
            </View>
        );
    });

    return (
        <Pressable
            onPress={() => {
                navigation.navigate('AddHabit', { id: habitCategory.id ?? 0 });
                if (expanded === undefined) {
                    setExpanded(true);
                } else {
                    setExpanded(!expanded);
                }
            }}
        >
            <HabitCategoryCard habitCategory={habitCategory} />
            <Animated.View style={{ height: height, overflow: 'hidden' }}>
                <View>{elements}</View>
            </Animated.View>
        </Pressable>
    );
};
