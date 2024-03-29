import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_LARGE, PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { NewUserChecklistElement } from 'resources/types/dto/NewUserChecklist';
import { NewUserChecklistElementDetailsModal } from './NewUserChecklistElementDetailsModal';
import { Ionicons } from '@expo/vector-icons';

interface Props {
    element: NewUserChecklistElement;
}

export const NewUserChecklistWidgetElement = ({ element }: Props) => {
    const { colors } = useTheme();

    const [modalVisible, setModalVisible] = React.useState(false);

    return (
        <Pressable
            disabled={element.complete}
            onPress={() => setModalVisible(true)}
            style={{
                borderColor: '#404040',
                backgroundColor: '#343434',
                borderWidth: 1,
                borderRadius: 5,
                flexDirection: 'row',
                paddingVertical: PADDING_SMALL,
                opacity: element.complete ? 0.4 : 1,
            }}
        >
            <NewUserChecklistElementDetailsModal
                visible={modalVisible}
                onDismiss={() => setModalVisible(false)}
                element={element}
            />

            <View
                style={{
                    paddingTop: PADDING_SMALL,
                    paddingLeft: PADDING_SMALL,
                }}
            >
                <View
                    style={{
                        height: 10,
                        width: 10,
                        bottom: 1,
                        borderRadius: 25,
                        backgroundColor: element.complete
                            ? colors.progress_bar_complete
                            : colors.secondary_text,
                    }}
                />
            </View>
            <View
                style={{
                    flex: 1,
                    paddingLeft: PADDING_SMALL,
                }}
            >
                <Text
                    style={{
                        color: colors.text,
                        includeFontPadding: false,
                        fontFamily: POPPINS_REGULAR,
                    }}
                >
                    {element.title}
                </Text>

                <Text
                    style={{
                        paddingTop: PADDING_SMALL,
                        color: colors.secondary_text,
                        fontSize: 10,
                        includeFontPadding: false,
                        fontFamily: POPPINS_REGULAR,
                    }}
                >
                    {element.description}
                </Text>
            </View>

            <View
                style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: PADDING_LARGE,
                }}
            >
                {!element.complete && (
                    <Ionicons
                        name={'information-circle-outline'}
                        size={16}
                        color={colors.accent_color_light}
                    />
                )}
            </View>
        </Pressable>
    );
};
