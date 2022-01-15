import * as React from 'react';
import { Text, TextInput, TextStyle, ViewStyle } from 'react-native';
import { useTheme } from 'src/components/theme/ThemeProvider';

interface Props {
    text: string,
    editable: boolean,
    onChangeText: Function
}

export const EditableTextBox = ({ text, editable, onChangeText }: Props) => {
    const { colors } = useTheme();

    const textStyle = {
        fontSize: 14,
        color: colors.text,
    } as TextStyle;

    const inputStyle =  {
          height: 40,
          margin: 12,
          borderWidth: 1,
          borderColor: colors.secondary_border,
          padding: 10,
        } as ViewStyle;

        const updateText = (newText: string) => {
            onChangeText(newText);
        };

    return (
        editable
            ? <TextInput style={[textStyle, inputStyle]} onChangeText={updateText} value={text} />
            : <Text style={textStyle}>{text}</Text>
    )
}