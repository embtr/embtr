import React from 'react';
import { Text, View } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { PADDING_SMALL, POPPINS_REGULAR } from 'src/util/constants';
import { NewUserChecklistElement } from 'resources/types/dto/NewUserChecklist';

interface Props {
    element: NewUserChecklistElement;
}

export const NewUserChecklistWidgetElement = ({ element }: Props) => {
    const { colors } = useTheme();

    console.log('element', element);

    return (
        <View
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
            <View
                style={{
                    paddingTop: PADDING_SMALL,
                    paddingLeft: PADDING_SMALL,
                }}
            >
                <View>
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
        </View>
    );
};
