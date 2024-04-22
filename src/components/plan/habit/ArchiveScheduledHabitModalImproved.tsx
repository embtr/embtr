import { View, Text } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_MEDIUM, POPPINS_REGULAR } from 'src/util/constants';
import { useCreateEditScheduleHabit } from 'src/contexts/habit/CreateEditScheduledHabitContext';
import { EmbtrModal } from 'src/components/common/modal/EmbtrModal';
import { TouchableOpacity } from 'react-native-gesture-handler';

interface Props {
    visible: boolean;
    onArchive: Function;
    onDismiss: Function;
}

export const ArchiveScheduledHabitModalImproved = ({ visible, onArchive, onDismiss }: Props) => {
    const { colors } = useTheme();

    const { title } = useCreateEditScheduleHabit();

    const onHandleDismiss = () => {
        onDismiss();
    };

    const body = (
        <View style={{ alignItems: 'center', margin: PADDING_LARGE }}>
            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
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
                    Archive{' '}
                    <Text
                        style={{
                            color: colors.accent_color_light,
                        }}
                    >
                        {title}
                    </Text>
                </Text>

                <View style={{ paddingTop: PADDING_LARGE }} />

                <View
                    style={{
                        borderColor: '#404040',
                        backgroundColor: '#343434',
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignContent: 'center',
                        borderRadius: 5,
                        padding: PADDING_SMALL,
                        width: '100%',
                    }}
                >
                    <View
                        style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                        }}
                    >
                        <Text
                            style={{
                                color: colors.secondary_text,
                                bottom: 1,
                                fontFamily: POPPINS_REGULAR,
                                paddingTop: PADDING_SMALL,
                            }}
                        >
                            Warning! Once you archive this habit, you will no longer be able to work
                            on it.
                        </Text>
                    </View>
                </View>

                <View style={{ paddingTop: PADDING_LARGE }} />

                <View
                    style={{
                        flexDirection: 'row',
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'flex-end',
                            flex: 1,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                backgroundColor: colors.link,
                                paddingVertical: 5,
                                borderRadius: 6,
                            }}
                            onPress={() => {
                                onHandleDismiss();
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
                                Nevermind!
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flex: 1,
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                marginTop: 2.5,
                                width: '90%',
                                paddingVertical: 5,
                                borderRadius: 6,
                            }}
                            onPress={() => {
                                onArchive();
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    fontSize: 14,
                                    fontFamily: POPPINS_REGULAR,
                                    top: 2,
                                    color: colors.archive,
                                    paddingHorizontal: PADDING_LARGE * 3,
                                }}
                            >
                                Archive
                            </Text>
                        </TouchableOpacity>
                    </View>
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
