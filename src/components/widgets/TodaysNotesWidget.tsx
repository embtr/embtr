import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { POPPINS_SEMI_BOLD } from 'src/util/constants';
import { useTheme } from '../theme/ThemeProvider';
import { WidgetBase } from './WidgetBase';

export const TodaysNotesWidget = () => {
    const { colors } = useTheme();
    const [updatedDescription, setUpdatedDescription] = React.useState<string>('');

    return (
        <WidgetBase>
            <Text style={{ color: colors.text, fontFamily: POPPINS_SEMI_BOLD, fontSize: 15 }}>Today's Notes</Text>
            <View style={{ paddingTop: 5 }}>
                <TextInput
                    textAlignVertical="top"
                    style={{
                        height: 200,
                        borderRadius: 12,
                        backgroundColor: colors.text_input_background,
                        borderColor: colors.text_input_border,
                        borderWidth: 1,
                        color: colors.text,
                        paddingTop: 10,
                        paddingLeft: 10,
                        paddingRight: 10,
                    }}
                    multiline={true}
                    placeholder={'How did the day go?'}
                    placeholderTextColor={colors.secondary_text}
                    onChangeText={setUpdatedDescription}
                    value={updatedDescription}
                />
            </View>
        </WidgetBase>
    );
};
