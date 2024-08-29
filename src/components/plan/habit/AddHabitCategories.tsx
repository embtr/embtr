import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import { Banner } from 'src/components/common/Banner';
import { Routes } from 'src/navigation/RootStackParamList';
import { Screen } from 'src/components/common/Screen';
import { HabitCategoryElement } from './HabitCategoryElement';
import { ScrollView } from 'react-native-gesture-handler';
import { HabitCustomHooks } from 'src/controller/habit/HabitController';
import { CARD_SHADOW, PADDING_LARGE, POPPINS_REGULAR } from 'src/util/constants';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { useEmbtrNavigation } from 'src/hooks/NavigationHooks';

export const AddHabitCategories = () => {
    const colors = useTheme().colors;
    const navigation = useEmbtrNavigation();

    const allHabitCategories = HabitCustomHooks.useAllHabitCategories();

    const elements: JSX.Element[] = [];
    allHabitCategories.forEach((habitCategory, index) => {
        elements.push(
            <View
                style={{
                    marginBottom: index === allHabitCategories.length - 1 ? PADDING_LARGE * 4 : 0,
                }}
            >
                <HabitCategoryElement key={habitCategory.id} habitCategory={habitCategory} />
            </View>
        );
    });

    return (
        <Screen>
            <View style={{ height: '100%', width: '100%' }}>
                <Banner
                    name="Habit Categories"
                    leftText="close"
                    leftOnClick={() => {
                        navigation.goBack();
                    }}
                />
                <ScrollView style={{ flex: 1 }}>{elements}</ScrollView>
                <View
                    style={{
                        width: '100%',
                        position: 'absolute',
                        zIndex: 1,
                        alignSelf: 'center',
                        bottom: 0,
                        marginBottom: PADDING_LARGE,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate(Routes.CREATE_EDIT_SCHEDULED_HABIT, {
                                isCreateCustomHabit: true,
                            });
                        }}
                    >
                        <View
                            style={[
                                {
                                    height: 50 - PADDING_LARGE,
                                    marginHorizontal: PADDING_LARGE,
                                    marginTop: PADDING_LARGE,
                                    backgroundColor: colors.accent_color,
                                    justifyContent: 'center',
                                    borderRadius: 3,
                                },
                                CARD_SHADOW,
                            ]}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    color: colors.text,
                                    fontFamily: POPPINS_REGULAR,
                                    fontSize: 16,
                                }}
                            >
                                Create Custom Habit
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </Screen>
    );
};
