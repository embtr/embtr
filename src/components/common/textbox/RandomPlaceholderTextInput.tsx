import React from 'react';
import { TextInput } from 'react-native-gesture-handler';
import { useTheme } from 'src/components/theme/ThemeProvider';
import { getRandomInt } from 'src/util/GeneralUtility';

interface Props {
    value: string;
    onChangeValue: Function;
    placeholderOptions: string[];
}
export const RandomPlaceHolderTextInput = ({ value, onChangeValue, placeholderOptions }: Props) => {
    const { colors } = useTheme();

    const [currentPlaceholderIndex, setCurrentPlaceholderIndex] = React.useState<number>(getRandomInt(0, placeholderOptions.length - 1));
    const [currentPlaceHolderCharacterIndex, setCurrentPlaceHolderCharacterIndex] = React.useState<number>(-1);
    const [currentPlaceHolder, setCurrentPlaceHolder] = React.useState<string>(placeholderOptions[currentPlaceholderIndex]);
    const [placeholderUpdated, setPlaceholderUpdated] = React.useState<Date>(new Date());

    React.useEffect(() => {
        setTimeout(() => {
            let newIndex = currentPlaceholderIndex;
            while (newIndex === currentPlaceholderIndex) {
                newIndex = getRandomInt(0, placeholderOptions.length - 1);
            }

            setCurrentPlaceholderIndex(newIndex);
            setCurrentPlaceHolderCharacterIndex(0);
        }, 3000);
    }, [placeholderUpdated]);

    React.useEffect(() => {
        if (currentPlaceHolderCharacterIndex === -1) {
            return;
        }
        setTimeout(() => {
            const placeholder = placeholderOptions[currentPlaceholderIndex];

            if (currentPlaceHolderCharacterIndex >= placeholder.length) {
                setCurrentPlaceHolder(placeholder.substring(0, currentPlaceHolderCharacterIndex));
                setPlaceholderUpdated(new Date());
            } else {
                const newCharIndex = currentPlaceHolderCharacterIndex + 1;
                setCurrentPlaceHolder(placeholder.substring(0, currentPlaceHolderCharacterIndex) + '|');
                setCurrentPlaceHolderCharacterIndex(newCharIndex);
            }
        }, 75);
    }, [currentPlaceHolderCharacterIndex]);

    const onChangeText = (newValue: string) => {
        onChangeValue(newValue);
    };

    return (
        <TextInput
            style={{
                padding: 15,
                fontFamily: 'Poppins_400Regular',
                color: colors.text,
                borderRadius: 12,
                backgroundColor: colors.text_input_background,
                borderColor: colors.text_input_border,
                borderWidth: 1,
                width: '95%',
            }}
            placeholder={'ex. ' + currentPlaceHolder}
            placeholderTextColor={colors.secondary_text}
            onChangeText={onChangeText}
            //onChange={() => { setTitleError(false) }}
            value={value}
            autoCorrect={true}
        />
    );
};
