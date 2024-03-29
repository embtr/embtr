import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { EmbtrModal } from 'src/components/common/modal/EmbtrModal';
import { NewUserChecklistElement } from 'resources/types/dto/NewUserChecklist';
import { PADDING_LARGE, PADDING_MEDIUM, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { Image } from 'expo-image';

const todayIcon = (
    <View style={{ bottom: 2, paddingHorizontal: 3 }}>
        <Image
            source={require('assets/logo.png')}
            style={{
                top: 0.5,
                width: 15 * 0.9,
                height: 15 * 0.9,
            }}
        />
    </View>
);

const myHabitsIcon = (
    <View style={{ bottom: 1, paddingHorizontal: 2 }}>
        <Ionicons name={'list-circle'} size={16} color={'#8C909E'} />
    </View>
);

const createHabitSteps = (colors: any, element: NewUserChecklistElement) => {
    const habitSteps = element.steps.map((step) => {
        return createHabitStep(colors, step);
    });
    habitSteps.unshift(createNavigateStep(colors, element.tab));

    return habitSteps;
};

const createNavigateStep = (colors: any, tab: string) => {
    const text = tab === 'TODAY' ? 'Today' : 'My Habits';
    const icon = tab === 'TODAY' ? todayIcon : myHabitsIcon;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
                style={{
                    fontSize: 12,
                    fontFamily: POPPINS_REGULAR,
                    color: colors.text,
                }}
            >
                - Navigate to the
            </Text>
            {icon}
            <Text
                style={{
                    fontSize: 12,
                    fontFamily: POPPINS_REGULAR,
                    color: colors.text,
                }}
            >
                {text} tab
            </Text>
        </View>
    );
};

const createHabitStep = (colors: any, step: string) => {
    return (
        <Text
            style={{
                fontSize: 12,
                fontFamily: POPPINS_REGULAR,
                color: colors.text,
            }}
        >
            - {step}
        </Text>
    );
};

interface Props {
    visible: boolean;
    onDismiss: Function;
    element: NewUserChecklistElement;
}

export const NewUserChecklistElementDetailsModal = ({ visible, onDismiss, element }: Props) => {
    const { colors } = useTheme();

    const habitSteps = createHabitSteps(colors, element);

    const body = (
        <View style={{ alignItems: 'center', paddingVertical: PADDING_LARGE }}>
            {/* TITLE SECTION */}
            <View
                style={{
                    width: '100%',
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            fontFamily: POPPINS_MEDIUM,
                            color: colors.text,
                            textAlign: 'center',
                        }}
                    >
                        {element.title}
                    </Text>
                </View>
            </View>

            {/* INSTRUCTIONS SECTION */}
            <View
                style={{
                    paddingTop: PADDING_LARGE,
                    width: '100%',
                }}
            >
                <Text
                    style={{
                        textAlign: 'center',
                        fontSize: 12,
                        fontFamily: POPPINS_REGULAR,
                        paddingLeft: PADDING_MEDIUM,
                        paddingRight: PADDING_MEDIUM,
                        color: colors.text,
                    }}
                >
                    {element.description}
                </Text>
            </View>

            {/* INSTRUCTIONS SECTION */}
            <View
                style={{
                    paddingTop: PADDING_LARGE,
                    paddingHorizontal: PADDING_LARGE,
                    width: '100%',
                }}
            >
                <View
                    style={{ backgroundColor: '#404040', padding: PADDING_LARGE, borderRadius: 6 }}
                >
                    {habitSteps}
                </View>
            </View>

            {/* BUTTONS SECTION */}
            <View
                style={{
                    paddingTop: PADDING_LARGE,
                    width: '100%',
                }}
            >
                <View
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            backgroundColor: colors.accent_color_light,
                            paddingVertical: 5,
                            borderRadius: 6,
                        }}
                        onPress={() => {
                            onDismiss();
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                fontSize: 14,
                                fontFamily: POPPINS_REGULAR,
                                top: 2,
                                color: colors.text,
                                paddingHorizontal: PADDING_LARGE * 3,
                            }}
                        >
                            Got it!
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );

    return (
        <EmbtrModal visible={visible} onDismiss={onDismiss}>
            {body}
        </EmbtrModal>
    );
};
